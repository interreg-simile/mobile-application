// noinspection JSAnnotator
const dummyObs: ObsInfo = {
    uid      : "5dd7bbe0701d5bdd685c1f18",
    position : {
        type       : "Point",
        coordinates: [9.45621358, 45.12346895],
        crs        : { code: 1, description: "WGS 84" },
        accuracy   : 20,
        custom     : true,
        roi        : "00000000000000000000001"
    },
    weather  : {
        temperature: 21.5,
        sky        : { code: 1, description: "Cielo sereno" },
        wind       : 25.63
    },
    photos   : [
        "https://media.istockphoto.com/photos/lake-water-pollution-picture-id1026572746",
        "https://previews.123rf.com/images/smithore/smithore0810/smithore081000070/3792785-very-important-plastic-and-trash-pollution-on-beautiful-lake.jpg",
        "https://thumbs.dreamstime.com/z/pollution-lake-fresh-water-plastic-trash-dirty-waste-beach-summer-day-beautiful-nature-peoplelessness-150318577.jpg"
    ],
    details  : {
        algae  : {
            checked   : true,
            extension : { code: 1, description: "< 5 mq" },
            look      : { code: 1, description: "Disperse" },
            colour    : { code: 1, description: "Rosso" },
            iridescent: true
        },
        foams  : {
            checked  : true,
            extension: { code: 1, description: "< 5 mq" },
            look     : { code: 1, description: "Disperse" },
            height   : { code: 1, description: "< 3 cm" }
        },
        oils   : {
            checked  : true,
            extension: { code: 1, description: "< 5 mq" },
            type     : { code: 1, description: "Superficiale" }
        },
        litters: {
            checked : true,
            quantity: { code: 1, description: "1" },
            type    : [
                { code: 1, description: "Plastica" },
                { code: 2, description: "Vetro / Ceramica" },
                { code: 3, description: "Metallo" }
            ]
        },
        odours : {
            checked  : true,
            intensity: { code: 1, description: "Lieve" },
            origin   : [{ code: 1, description: "Pesce" }, { code: 2, description: "Muffa" }]
        },
        outlets: {
            checked             : true,
            inPlace             : true,
            terminal            : { code: 1, description: "Visibile" },
            colour              : { code: 1, description: "Rosso" },
            vapour              : false,
            signage             : true,
            signagePhoto        : "https://www.google.com/url?sa=i&url=http%3A%2F%2Fwww.wwfbergamobrescia.it%2F2018%2F09%2F18%2Fscarichi-fognari-nel-lago-di-garda-la-situazione-di-allarme-si-protrae-ormai-da-anni%2F&psig=AOvVaw3ThZC4RpbukKcOACL5HZqW&ust=1583144852371000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCKCK5KaI-ecCFQAAAAAdAAAAABAE",
            prodActNearby       : true,
            prodActNearbyDetails: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris"
        },
        fauna  : {
            checked    : true,
            fish       : {
                checked : true,
                deceased: { checked: true, number: 20 },
                abnormal: {
                    checked: true,
                    details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"
                },
                alien   : {
                    checked: true,
                    species: [{ code: 1, description: "Pseudorasbora" }]
                }
            },
            birds      : {
                checked : true,
                deceased: { checked: true, number: 20 },
                abnormal: { checked: true }
            },
            molluscs   : {
                checked : true,
                abnormal: {
                    checked: true,
                    details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"
                }
            },
            crustaceans: {
                checked : true,
                deceased: { checked: true, number: 2 },
                alien   : {
                    checked: true,
                    species: [
                        { code: 1, description: "Gambero americano" },
                        { code: 2, description: "Gambero della California" }
                    ]
                }
            },
            turtles    : {
                checked: true,
                alien  : {
                    checked: true,
                    species: [{ code: 1, description: "Testuggine palustre americana" }]
                }
            }
        }
    },
    measures : {
        transparency: {
            val       : 2,
            instrument: {
                type     : { code: 1, description: "Professionale" },
                precision: 2,
                details  : "Lorem ipsum dolor sit amet, consectetur adipiscing elit"
            }
        },
        temperature : {
            multiple  : true,
            val       : [{ depth: 1, val: 25 }, { depth: 2, val: 24 }, { depth: 5, val: 20 }],
            instrument: {
                type     : { code: 1, description: "Professionale" },
                precision: 2,
                details  : "Lorem ipsum dolor sit amet, consectetur adipiscing elit"
            }
        },
        ph          : {
            multiple  : false,
            val       : [{ depth: 1, val: 7 }],
            instrument: {
                type     : { code: 1, description: "Professionale" },
                precision: 2,
                details  : "Lorem ipsum dolor sit amet, consectetur adipiscing elit"
            }
        },
        oxygen      : {
            multiple  : true,
            percentage: true,
            val       : [{ depth: 1, val: 23 }, { depth: 2, val: 25 }, { depth: 3, val: 24 }],
            instrument: {
                type     : { code: 1, description: "Professionale" },
                precision: 2,
                details  : "Lorem ipsum dolor sit amet, consectetur adipiscing elit"
            }
        },
        bacteria    : {
            escherichiaColi: 100,
            enterococci    : 130
        }
    },
    other    : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    createdAt: "2020-02-29T15:23:06.121+00:00",
    updatedAt: "2020-02-29T15:23:06.121+00:00"
};
