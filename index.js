require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
const { parseExcelAsset, parseRequest } = require("./util");

const { parsFormData } = require("store-file");

const PORT = process.env.PORT || 4064;

/** middlewares */
app.use(cors());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
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
    parseRequest(process.env.BASE_URL, res, params);
};

app.route("/asset")
    .get(checkForSheetName, (req, res) => {
        const { Kode } = req.query;
        parseRequestSheetAsset(res, {
            route: "getData",
            sheetName: req.sheetName,
            Kode,
        });
    })
    .post(checkForSheetName, (req, res) => {
        const { data, datas } = req.body;
        parseRequestSheetAsset(res, {
            route: datas ? "addManyData" : "addData",
            sheetName: req.sheetName,
            data,
            datas,
        });
    })
    .put(checkForSheetName, (req, res) => {
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
    .delete(checkForSheetName, (req, res) => {
        const { Kode, Kodes } = req.body;
        parseRequestSheetAsset(res, {
            route: Kodes ? "deleteManyData" : "deleteData",
            sheetName: req.sheetName,
            Kode,
            Kodes,
        });
    });

app.post("/asset/:action", checkForSheetName, parsFormData, async (req, res) => {
    const { action } = req.params;
    if (action === "export") {
        const { files } = req;
        if (!files || (files && !files.length))
            return res.status(400).json({
                msg: "please include your xlsx file",
            });
        const { sheetName } = req.body || req;
        const datas = await parseExcelAsset(files[0].buffer);
        return parseRequestSheetAsset(res, { sheetName, route: "addManyData", datas });
    }

    res.status(404).json({
        msg: "Handler Not Found",
    });
});

app.get("/asset-names", async (req, res) => {
    return parseRequestSheetAsset(res, { route: "getSheetNames" });
});
/** asset management API */

/** UltraElevation Sonic API */
const parseRequestUES = (res, params) => {
    parseRequest(process.env.UES_URL, res, params);
};

app.route("/ues")
    .get((req, res) => {
        const { id } = req.query;
        parseRequestUES(res, {
            route: "read",
            id,
        });
    })
    .post((req, res) => {
        const { id } = req.body;
        parseRequestUES(res, {
            route: "init",
            id,
        });
    })
    .put((req, res) => {
        const { id, type, newValue } = req.body;
        parseRequestUES(res, {
            route: "crange",
            id,
            type,
            newValue,
        });
    })
    .patch((req, res) => {
        const { id, oldValue, newValue } = req.body;
        parseRequestUES(res, {
            route: "ckey",
            id,
            oldValue,
            newValue,
        });
    })
    .delete((req, res) => {
        const { id } = req.body;
        parseRequestUES(res, {
            route: "delete",
            id,
        });
    });
/** UltraElevation Sonic API */

app.listen(PORT, () => console.log(`running at http://localhost:${PORT}`));
