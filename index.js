require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const { parseExcelAsset } = require("./util");

const PORT = process.env.PORT || 4064;

/** middlewares */
app.use(cors());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

const upload = multer({
    dest: "files/", // Location where files will be saved
});
/** middlewares */

/** root */
app.all("/", (req, res) => {
    res.status(200).json({
        msg: "running..",
    });
});
/** root */

/** asset management API */
const checkForSheetName = (req, res, next) => {
    const sheetName = req.query.sheetName || req.body.sheetName || req.header.sheetName;

    if (!sheetName) {
        res.status(400).json({
            success: false,
            msg: "please define 'sheetName'",
        });
        return;
    }

    req.sheetName = sheetName;
    next();
};

const parseRequestSheetAsset = (res, params) => {
    axios
        .post(process.env.BASE_URL, params)
        .then((result) => {
            res.status(200).json(result.data);
        })
        .catch((error) => {
            res.status(500).json({
                error,
            });
        });
};

app.route("/asset/:action").post(upload.any(), async (req, res) => {
    const { action } = req.params;
    if (action === "export") {
        const { files } = req;
        const { sheetName } = req.body;
        const datas = await parseExcelAsset(files[0].path);
        parseRequestSheetAsset(res, { sheetName, route: "addManyData", datas });
    }
});

app.use("/asset", checkForSheetName, upload.any());

app.route("/asset")
    .get((req, res) => {
        const { Kode } = req.query;
        parseRequestSheetAsset(res, {
            route: "getData",
            sheetName: req.sheetName,
            Kode,
        });
    })
    .post((req, res) => {
        const { data, datas } = req.body;
        parseRequestSheetAsset(res, {
            route: datas ? "addManyData" : "addData",
            sheetName: req.sheetName,
            data,
            datas,
        });
    })
    .put((req, res) => {
        const { Kode, Kodes, data, datas } = req.body;
        parseRequestSheetAsset(res, {
            route: Kodes ? "updateManyData" : "updateData",
            sheetName: req.sheetName,
            Kode,
            data,
            Kodes,
            datas,
        });
    })
    .delete((req, res) => {
        const { Kode, Kodes } = req.body;
        parseRequestSheetAsset(res, {
            route: Kodes ? "deleteManyData" : "deleteData",
            sheetName: req.sheetName,
            Kode,
            Kodes,
        });
    });
/** asset management API */

app.listen(PORT, () => console.log(`running at http://localhost:${PORT}`));
