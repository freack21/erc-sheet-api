const { default: axios } = require("axios");
const readXlsxFile = require("read-excel-file/node");

exports.createData = (
    nama_barang,
    jumlah,
    gambar,
    lokasi_box,
    tersedia,
    rusak,
    hilang,
    dipinjam
) => ({
    "Lokasi Box": lokasi_box || "",
    "Nama Barang": nama_barang || "",
    Jumlah: jumlah || "",
    Tersedia: tersedia || "",
    Rusak: rusak || "",
    Hilang: hilang || "",
    Dipinjam: dipinjam || "",
    Gambar: gambar || "",
});

exports.parseExcelAsset = async (data) => {
    const schema = {
        "Lokasi Box": {
            type: String,
            prop: "Lokasi Box",
        },
        "Nama Barang": {
            type: String,
            prop: "Nama Barang",
            required: true,
        },
        Jumlah: {
            type: String,
            prop: "Jumlah",
        },
        Tersedia: {
            type: String,
            prop: "Tersedia",
        },
        Rusak: {
            type: String,
            prop: "Rusak",
        },
        Hilang: {
            type: String,
            prop: "Hilang",
        },
        Dipinjam: {
            type: String,
            prop: "Dipinjam",
        },
        Gambar: {
            type: String,
            prop: "Gambar",
        },
    };
    return new Promise((resolve) => {
        readXlsxFile(data, { schema, sheet: 1 }).then(({ rows }) => {
            resolve(rows);
        });
    });
};

exports.parseRequest = async (url, res, params) => {
    try {
        const result = await axios.post(url, params);
        res.status(200).json(result.data).end();
    } catch (error) {
        res.status(500)
            .json({
                error,
            })
            .end();
    }
};
