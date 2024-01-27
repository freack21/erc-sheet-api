require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");

const PORT = process.env.PORT || 4064;

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.all("/", (req, res) => {
    res.status(200).json({
        msg: "running..",
    });
});

const parseRequest = (res, params) => {
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

app.route("/asset")
    .get((req, res) => {
        const { sheetName, Kode } = req.query;
        parseRequest(res, {
            route: "getData",
            sheetName,
            Kode,
        });
    })
    .post((req, res) => {
        const { sheetName, data, datas } = req.body;
        parseRequest(res, {
            route: datas ? "addManyData" : "addData",
            sheetName,
            data,
            datas,
        });
    })
    .put((req, res) => {
        const { sheetName, Kode, Kodes, data, datas } = req.body;
        parseRequest(res, {
            route: Kodes ? "updateManyData" : "updateData",
            sheetName,
            Kode,
            data,
            Kodes,
            datas,
        });
    })
    .delete((req, res) => {
        const { sheetName, Kode, Kodes } = req.body;
        parseRequest(res, {
            route: Kodes ? "deleteManyData" : "deleteData",
            sheetName,
            Kode,
            Kodes,
        });
    });

app.listen(PORT, () => console.log(`running at http://localhost:${PORT}`));
