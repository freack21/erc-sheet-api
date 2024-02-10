require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
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

const parseRequestSheetAsset = async (res, params) => {
    await parseRequest(process.env.BASE_URL, res, params);
};

app.route("/asset")
    .get(checkForSheetName, async (req, res) => {
        const { Kode } = req.query;
        return await parseRequestSheetAsset(res, {
            route: "getData",
            sheetName: req.sheetName,
            Kode,
        });
    })
    .post(checkForSheetName, async (req, res) => {
        const { data, datas } = req.body;
        return await parseRequestSheetAsset(res, {
            route: datas ? "addManyData" : "addData",
            sheetName: req.sheetName,
            data,
            datas,
        });
    })
    .put(checkForSheetName, async (req, res) => {
        const { Kode, Kodes, data, datas } = req.body;
        return await parseRequestSheetAsset(res, {
            route: Kodes ? "updateManyData" : "updateData",
            sheetName: req.sheetName,
            Kode,
            data,
            Kodes,
            datas,
        });
    })
    .delete(checkForSheetName, async (req, res) => {
        const { Kode, Kodes } = req.body;
        return await parseRequestSheetAsset(res, {
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
        return await parseRequestSheetAsset(res, { sheetName, route: "addManyData", datas });
    }

    res.status(404).json({
        msg: "Handler Not Found",
    });
});

app.get("/asset-names", async (req, res) => {
    await parseRequestSheetAsset(res, { route: "getSheetNames" });
});
/** asset management API */

/** UltraElevation Sonic API */
const parseRequestUES = async (res, params) => {
    return await parseRequest(process.env.UES_URL, res, params);
};

app.route("/ues")
    .get(async (req, res) => {
        const { id } = req.query;
        return await parseRequestUES(res, {
            route: "read",
            id,
        });
    })
    .post(async (req, res) => {
        const { id } = req.body;
        return await parseRequestUES(res, {
            route: "init",
            id,
        });
    })
    .put(async (req, res) => {
        const { id, type, newValue } = req.body;
        return await parseRequestUES(res, {
            route: "crange",
            id,
            type,
            newValue,
        });
    })
    .patch(async (req, res) => {
        const { id, oldValue, newValue } = req.body;
        return await parseRequestUES(res, {
            route: "ckey",
            id,
            oldValue,
            newValue,
        });
    })
    .delete(async (req, res) => {
        const { id } = req.body;
        return await parseRequestUES(res, {
            route: "delete",
            id,
        });
    });
/** UltraElevation Sonic API */

app.listen(PORT, () => console.log(`running at http://localhost:${PORT}`));
