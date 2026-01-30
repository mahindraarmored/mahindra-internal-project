const mapData = {
    managerColors: {
        "MR. RAJIV": "#3b82f6",
        "MR. NADER": "#10b981",
        "MR. ROWAN": "#f59e0b",
        "MR. LYES": "#6366f1",
        "MR. CRISTIAN": "#8b5cf6",
        "MR. AZMI": "#06b6d4",
        "MR. MARCOS": "#f43f5e",
        "SUJITHA": "#ec4899",
        "OPEN": "#ef4444"
    },
    countries: [
        // MR. RAJIV
        { name: "Kenya", manager: "MR. RAJIV", coords: [-1.2863, 36.8172] },
        { name: "Papua New Guinea", manager: "MR. RAJIV", coords: [-6.3150, 143.9555] },
        { name: "Mozambique", manager: "MR. RAJIV", coords: [-18.6657, 35.5296] },
        { name: "Cambodia", manager: "MR. RAJIV", coords: [12.5657, 104.9910] },
        { name: "Congo (DRC)", manager: "MR. RAJIV", coords: [-4.0383, 21.7587] },
        { name: "Malawi", manager: "MR. RAJIV", coords: [-13.2543, 34.3015] },
        { name: "Uganda", manager: "MR. RAJIV", coords: [1.3733, 32.2903] },
        { name: "Cameroon", manager: "MR. RAJIV", coords: [7.3697, 12.3547] },
        { name: "Philippines", manager: "MR. RAJIV", coords: [12.8797, 121.7740] },
        { name: "Saudi Arabia", manager: "MR. RAJIV", coords: [23.8859, 45.0792] },
        { name: "Iraq", manager: "MR. RAJIV", coords: [33.2232, 43.6793] },
        { name: "Ghana", manager: "MR. RAJIV", coords: [7.9465, -1.0232] },

        // MR. NADER
        { name: "Egypt", manager: "MR. NADER", coords: [26.8206, 30.8025] },
        { name: "Afghanistan", manager: "MR. NADER", coords: [33.9391, 67.7100] },
        { name: "Haiti", manager: "MR. NADER", coords: [18.9712, -72.2852] },
        { name: "Rwanda", manager: "MR. NADER", coords: [-1.9403, 29.8739] },
        { name: "Thailand", manager: "MR. NADER", coords: [15.8700, 100.9925] },
        { name: "Tanzania", manager: "MR. NADER", coords: [-6.3690, 34.8888] },
        { name: "Bangladesh", manager: "MR. NADER", coords: [23.6850, 90.3563] },
        { name: "Malaysia", manager: "MR. NADER", coords: [4.2105, 101.9758] },

        // MR. ROWAN
        { name: "Zambia", manager: "MR. ROWAN", coords: [-13.1339, 27.8493] },
        { name: "Australia", manager: "MR. ROWAN", coords: [-25.2744, 133.7751] },
        { name: "South Africa", manager: "MR. ROWAN", coords: [-30.5595, 22.9375] },
        { name: "Nepal", manager: "MR. ROWAN", coords: [28.3949, 84.1240] },
        { name: "Brunei", manager: "MR. ROWAN", coords: [4.5353, 114.7277] },

        // MR. LYES
        { name: "Ivory Coast", manager: "MR. LYES", coords: [7.5399, -5.5471] },
        { name: "Algeria", manager: "MR. LYES", coords: [28.0339, 1.6596] },
        { name: "Tunisia", manager: "MR. LYES", coords: [33.8869, 9.5375] },
        { name: "Chad", manager: "MR. LYES", coords: [15.4542, 18.7322] },
        { name: "Angola", manager: "MR. LYES", coords: [-11.2027, 17.8739] },
        { name: "Gambia", manager: "MR. LYES", coords: [13.4432, -15.3101] },
        { name: "Burkina Faso", manager: "MR. LYES", coords: [12.2383, -1.5616] },
        { name: "Niger", manager: "MR. LYES", coords: [17.6078, 8.0817] },
        { name: "Mauritania", manager: "MR. LYES", coords: [21.0079, -10.9408] },
        { name: "Mali", manager: "MR. LYES", coords: [17.5707, -3.9962] },
        { name: "Togo", manager: "MR. LYES", coords: [8.6195, 0.8248] },
        { name: "Senegal", manager: "MR. LYES", coords: [14.4974, -14.4524] },

        // MR. CRISTIAN
        { name: "Argentina", manager: "MR. CRISTIAN", coords: [-38.4161, -63.6167] },
        { name: "Mexico", manager: "MR. CRISTIAN", coords: [23.6345, -102.5528] },
        { name: "Peru", manager: "MR. CRISTIAN", coords: [-9.1900, -75.0152] },
        { name: "Ecuador", manager: "MR. CRISTIAN", coords: [-1.8312, -78.1834] },
        { name: "Paraguay", manager: "MR. CRISTIAN", coords: [-23.4425, -58.4438] },
        { name: "Uruguay", manager: "MR. CRISTIAN", coords: [-32.5228, -55.7658] },
        { name: "Kosovo", manager: "MR. CRISTIAN", coords: [42.6026, 20.9030] },
        { name: "Nigeria", manager: "MR. CRISTIAN", coords: [9.0820, 8.6753] },
        { name: "Dominican Republic", manager: "MR. CRISTIAN", coords: [18.7357, -70.1627] },
        { name: "Jamaica", manager: "MR. CRISTIAN", coords: [18.1096, -77.2975] },

        // MR. AZMI
        { name: "Lebanon", manager: "MR. AZMI", coords: [33.8547, 35.8623] },
        { name: "Oman", manager: "MR. AZMI", coords: [21.4735, 55.9754] },
        { name: "Kuwait", manager: "MR. AZMI", coords: [29.3117, 47.4818] },
        { name: "Qatar", manager: "MR. AZMI", coords: [25.3548, 51.1839] },
        { name: "Bahrain", manager: "MR. AZMI", coords: [26.0667, 50.5577] },
        { name: "South Sudan", manager: "MR. AZMI", coords: [6.8770, 31.3070] },
        { name: "Somalia", manager: "MR. AZMI", coords: [5.1521, 46.1996] },
        { name: "Yemen", manager: "MR. AZMI", coords: [15.5527, 48.5164] },
        { name: "Morocco", manager: "MR. AZMI", coords: [31.7917, -7.0926] },
        { name: "Sri Lanka", manager: "MR. AZMI", coords: [7.8731, 80.7718] },

        // MR. MARCOS
        { name: "Spain", manager: "MR. MARCOS", coords: [40.4637, -3.7492] },
        { name: "France", manager: "MR. MARCOS", coords: [46.2276, 2.2137] },
        { name: "Germany", manager: "MR. MARCOS", coords: [51.1657, 10.4515] },
        { name: "Italy", manager: "MR. MARCOS", coords: [41.8719, 12.5674] },
        { name: "USA", manager: "MR. MARCOS", coords: [37.0902, -95.7129] },

        // OPEN
        { name: "Venezuela", manager: "OPEN", coords: [6.4238, -66.5897] },
        { name: "Bahamas", manager: "OPEN", coords: [25.0343, -77.3963] },
        { name: "Vietnam", manager: "OPEN", coords: [14.0583, 108.2772] },
        { name: "Singapore", manager: "OPEN", coords: [1.3521, 103.8198] }
    ],
    agencies: [
        { name: "UNICEF", manager: "MR. RAJIV", coords: [40.7505, -73.9671] },
        { name: "UNHCR", manager: "MR. RAJIV", coords: [46.2217, 6.1311] },
        { name: "ICRC Geneva", manager: "MR. NADER", coords: [46.2231, 6.1353] },
        { name: "World Bank Group", manager: "MR. ROWAN", coords: [38.8989, -77.0439] },
        { name: "US Dept of State - DSS", manager: "MR. ROWAN", coords: [38.8943, -77.0451] },
        { name: "UNOPS LTA", manager: "SUJITHA", coords: [55.6761, 12.5683] },
        { name: "JICA", manager: "MR. AZMI", coords: [35.6852, 139.7298] },
        { name: "WFP Dubai", manager: "OPEN", coords: [24.9918, 55.1568] }
    ]
};
