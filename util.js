const readXlsxFile = require("read-excel-file/node");
const fs = require("fs");

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

exports.parseExcelAsset = async (filename) => {
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
        readXlsxFile(filename, { schema, sheet: 1 }).then(({ rows }) => {
            fs.unlinkSync(filename);
            resolve(rows);
        });
    });
};
