const createData = (
    nama_barang,
    jumlah,
    gambar,
    lokasi_box,
    tersedia,
    rusak,
    hilang,
    dipinjam
) => ({
    "Lokasi Box": lokasi_box,
    "Nama Barang": nama_barang,
    Jumlah: jumlah,
    Tersedia: tersedia,
    Rusak: rusak,
    Hilang: hilang,
    Dipinjam: dipinjam,
    Gambar: gambar,
});
