export type Category = {
    id: string
    categoryName: string
    performances: Performance[]
}
//Backend kısmında JSON yapısında tek tablo olarak yazdığımız için front end tarafında da tek tablo olarak yazıyoruz.
export type Performance = {
    uniqueCode: string
    performanceName: string
    value: number
    price: number
    dailyChange: number
    weeklyChange: number
    monthlyChange: number
}
// Backend'deki Document sınıflarının TypeScript karşılıklarıdır. Bu sayede API'den gelen verileri TypeScript tipleri ile eşleştirerek daha güvenli ve hatasız bir şekilde kullanabiliriz.