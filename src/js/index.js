var app = new Vue({
    el: "#app",
    data: {
        message: "Hello world!",
        header: "Cinema WTF",
        cinemaList: [
            {
                region: "港島",
                list: [
                    "AMC 太古廣場", "L Cinema", "MCL JP", "MCL 康怡戲院", "MCL 海怡戲院", "MCL 皇室戲院", "UA Cine Times", "UA 銀河影院 Director's Club",
                    "新寶 總統戲院", "百老匯 PALACE ifc", "百老匯 數碼港"
                ]
            },
            {
                region: "九龍",
                list: [
                    "Cinema City 朗豪坊", "FESTIVAL GRAND CINEMA ", "MCL 德福戲院", "The Grand Cinema", "UA Cine Moko", "UA Cine Moko IMAX",
                    "UA iSQUARE", "UA iSQUARE IMAX", "UA iSQUARE 鳳凰影院", "UA MegaBox", "UA MegaBox BEA IMAX",
                    "嘉禾 the sky", "嘉禾 海運戲院", "嘉禾 黃埔", "寶石戲院", "影藝戲院", "新寶 新寶戲院", "新寶 豪華戲院", "星影匯", "百老匯 PALACE apm",
                    "百老匯 The ONE", "百老匯 旺角", "百老匯 荷里活", "百老匯電影中心"
                ]

            },
            {
                region: "新界",
                list: [
                    "MCL新都城戲院", "MCL粉嶺戲院", "STAR Cinema", "UA 屯門市廣場",
                    "UA 機場IMAX", "元朗戲院", "嘉禾 粉嶺", "嘉禾 荃新天地", "嘉禾 青衣", "巴黎倫敦紐約米蘭", "新寶 凱都", "百老匯 嘉湖銀座", "百老匯 荃灣",
                    "百老匯 葵芳", "馬鞍山戲院"
                ]
            },

        ]
    }
});
