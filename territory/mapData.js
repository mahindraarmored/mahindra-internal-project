const mapData = {
    managerColors: {
        "MR. RAJIV": "#f43f5e",
        "MR. NADER": "#10b981",
        "MR. ROWAN": "#f59e0b",
        "MR. LYES": "#6366f1",
        "MR. CRISTIAN": "#708090",
        "MR. AZMI": "#06b6d4",
        "MR. MARCOS": "#3b82f6",
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
    { name: "Saudi Arabia", manager: "MR. NADER", coords: [24.7136, 46.6753] }, // Shared Territory
    { name: "Iraq", manager: "MR. NADER", coords: [33.3152, 44.3661] }, // Shared Territory
    { name: "Bangladesh", manager: "MR. NADER", coords: [23.6850, 90.3563] },
    { name: "Malaysia", manager: "MR. NADER", coords: [4.2105, 101.9758] },

        // MR. ROWAN
        { name: "Zambia", manager: "MR. ROWAN", coords: [-13.1339, 27.8493] },
    { name: "Brunei", manager: "MR. ROWAN", coords: [4.5353, 114.7277] },
    { name: "Australia", manager: "MR. ROWAN", coords: [-25.2744, 133.7751] },
    { name: "South Africa", manager: "MR. ROWAN", coords: [-30.5595, 22.9375] },
    { name: "Nepal", manager: "MR. ROWAN", coords: [28.3949, 84.1240] },
    { name: "European Countries", manager: "MR. ROWAN", coords: [48.5260, 15.2551] }, // Central EU point

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
    { name: "DR Congo", manager: "MR. LYES", coords: [-4.0383, 21.7587] }, // Shared with Rajiv
    { name: "Togo", manager: "MR. LYES", coords: [8.6195, 0.8248] },
    { name: "Senegal", manager: "MR. LYES", coords: [14.4974, -14.4524] },

        // MR. CRISTIAN
        { name: "Argentina", manager: "MR. CRISTIAN", coords: [-38.4161, -63.6167] },
    { name: "Mexico", manager: "MR. CRISTIAN", coords: [23.6345, -102.5528] },
    { name: "Peru", manager: "MR. CRISTIAN", coords: [-9.1900, -75.0152] },
    { name: "Ecuador", manager: "MR. CRISTIAN", coords: [-1.8312, -78.1834] },
    { name: "Paraguay", manager: "MR. CRISTIAN", coords: [-23.4425, -58.4438] },
    { name: "Uruguay", manager: "MR. CRISTIAN", coords: [-32.5228, -55.7658] },
    { name: "Suriname", manager: "MR. CRISTIAN", coords: [3.9193, -56.0278] },
    { name: "Kosovo", manager: "MR. CRISTIAN", coords: [42.6026, 20.9030] },
    { name: "Nigeria", manager: "MR. CRISTIAN", coords: [9.0820, 8.6753] },
    { name: "Guatemala", manager: "MR. CRISTIAN", coords: [15.7835, -90.2308] },
    { name: "Dominican Republic", manager: "MR. CRISTIAN", coords: [18.7357, -70.1627] },
    { name: "Cuba", manager: "MR. CRISTIAN", coords: [21.5218, -77.7812] },
    { name: "Honduras", manager: "MR. CRISTIAN", coords: [15.1994, -86.2419] },
    { name: "Nicaragua", manager: "MR. CRISTIAN", coords: [12.8654, -85.2072] },
    { name: "El Salvador", manager: "MR. CRISTIAN", coords: [13.7942, -88.8965] },
    { name: "Costa Rica", manager: "MR. CRISTIAN", coords: [9.7489, -83.7534] },
    { name: "Panama", manager: "MR. CRISTIAN", coords: [8.5380, -80.7821] },
    { name: "Jamaica", manager: "MR. CRISTIAN", coords: [18.1096, -77.2975] },
    { name: "Trinidad and Tobago", manager: "MR. CRISTIAN", coords: [10.6918, -61.2225] },
    { name: "Guyana", manager: "MR. CRISTIAN", coords: [4.8604, -58.9302] },

        // MR. AZMI
        { name: "Lebanon", manager: "MR. AZMI", coords: [33.8547, 35.8623] },
    { name: "Oman", manager: "MR. AZMI", coords: [21.4735, 55.9754] },
    { name: "Kuwait", manager: "MR. AZMI", coords: [29.3117, 47.4818] },
    { name: "Qatar", manager: "MR. AZMI", coords: [25.3548, 51.1839] },
    { name: "Bahrain", manager: "MR. AZMI", coords: [26.0667, 50.5577] },
    { name: "South Sudan", manager: "MR. AZMI", coords: [6.8770, 31.3070] },
    { name: "Somalia", manager: "MR. AZMI", coords: [5.1521, 46.1996] },
    { name: "Kazakhstan", manager: "MR. AZMI", coords: [48.0196, 66.9237] },
    { name: "Yemen", manager: "MR. AZMI", coords: [15.5527, 48.5164] },
    { name: "Georgia", manager: "MR. AZMI", coords: [42.3154, 43.3569] },
    { name: "Morocco", manager: "MR. AZMI", coords: [31.7917, -7.0926] },
    { name: "Malta", manager: "MR. AZMI", coords: [35.9375, 14.3754] },
    { name: "Sri Lanka", manager: "MR. AZMI", coords: [7.8731, 80.7718] },
    { name: "Djibouti", manager: "MR. AZMI", coords: [11.8251, 42.5903] },
    { name: "Saudi Arabia", manager: "MR. AZMI", coords: [23.8859, 45.0792] }, // Multi-manager
    { name: "Iraq", manager: "MR. AZMI", coords: [33.2232, 43.6793] }, // Multi-manager
    { name: "Zimbabwe", manager: "MR. AZMI", coords: [-19.0154, 29.1549] },
    { name: "Turkmenistan", manager: "MR. AZMI", coords: [38.9697, 59.5563] },
    { name: "Ethiopia", manager: "MR. AZMI", coords: [9.1450, 40.4897] },
    { name: "Haiti", manager: "MR. AZMI", coords: [18.9712, -72.2852] }, // Multi-manager
    { name: "Canada", manager: "MR. AZMI", coords: [56.1304, -106.3468] },
    { name: "Togo", manager: "MR. AZMI", coords: [8.6195, 0.8248] },

        // MR. MARCOS
        { name: "Spain", manager: "MR. MARCOS", coords: [40.4637, -3.7492] },
    { name: "Portugal", manager: "MR. MARCOS", coords: [39.3999, -8.2245] },
    { name: "France", manager: "MR. MARCOS", coords: [46.2276, 2.2137] },
    { name: "Germany", manager: "MR. MARCOS", coords: [51.1657, 10.4515] },
    { name: "Finland", manager: "MR. MARCOS", coords: [61.9241, 25.7482] },
    { name: "Italy", manager: "MR. MARCOS", coords: [41.8719, 12.5674] },
    { name: "United States", manager: "MR. MARCOS", coords: [37.0902, -95.7129] },

        // OPEN
        { name: "Venezuela", manager: "OPEN", coords: [6.4238, -66.5897] },
    { name: "Bahamas", manager: "OPEN", coords: [25.0343, -77.3963] },
    { name: "Switzerland", manager: "OPEN", coords: [46.8182, 8.2275] },
    { name: "Vietnam", manager: "OPEN", coords: [14.0583, 108.2772] },
    { name: "Singapore", manager: "OPEN", coords: [1.3521, 103.8198] },
    { name: "Lithuania", manager: "OPEN", coords: [55.1694, 23.8813] },
    { name: "Mongolia", manager: "OPEN", coords: [46.8625, 103.8467] },
    { name: "Myanmar", manager: "OPEN", coords: [21.9162, 95.9560] },
    { name: "Bolivia", manager: "OPEN", coords: [-16.2902, -63.5887] },
    { name: "East Timor", manager: "OPEN", coords: [-8.8742, 125.7275] },
    { name: "Laos", manager: "OPEN", coords: [19.8563, 102.4955] },
    { name: "Namibia", manager: "OPEN", coords: [-22.9576, 18.4904] },
    { name: "Turkey", manager: "OPEN", coords: [38.9637, 35.2433] },
    { name: "Botswana", manager: "OPEN", coords: [-22.3285, 24.6849] },
    { name: "Hong Kong", manager: "OPEN", coords: [22.3193, 114.1694] },
    { name: "USA", manager: "OPEN", coords: [37.0902, -95.7129] }, // General Open Lead
    { name: "Indonesia", manager: "OPEN", coords: [-0.7893, 113.9213] }
    ],
    agencies: [
        { name: "Alpine US", manager: "MR. RAJIV", coords: [40.7128, -74.0060] }, // HQ Location
    { name: "Control Risk", manager: "MR. RAJIV", coords: [51.5074, -0.1278] }, // London HQ
    { name: "TGS", manager: "MR. RAJIV", coords: [43.6108, 3.8767] }, // France
    { name: "UNICEF", manager: "MR. RAJIV", coords: [40.7505, -73.9671] }, // NYC HQ
    { name: "UNHCR", manager: "MR. RAJIV", coords: [46.2217, 6.1311] },  // Geneva HQ
        { name: "ICRC Geneva", manager: "MR. NADER", coords: [46.2231, 6.1353] },
    { name: "Medecin Sans Frontier (MSF)", manager: "MR. NADER", coords: [46.2205, 6.1289] },
    { name: "OCHA Yemen", manager: "MR. NADER", coords: [15.3694, 44.1910] },
    { name: "Norwegian Refugee Council", manager: "MR. NADER", coords: [59.9139, 10.7522] }, // Oslo HQ
    { name: "Local Traders UAE", manager: "MR. NADER", coords: [25.2048, 55.2708] },
    { name: "IFRC", manager: "MR. NADER", coords: [46.2272, 6.1307] },
    { name: "IOM Local Office", manager: "MR. NADER", coords: [25.2769, 55.2962] },
        { name: "France - Technamm", manager: "MR. ROWAN", coords: [43.5297, 5.4474] },
    { name: "France - S2M (MFAO)", manager: "MR. ROWAN", coords: [48.8566, 2.3522] },
    { name: "GardaWorld", manager: "MR. ROWAN", coords: [45.5017, -73.5673] }, // Montreal HQ
    { name: "CSI LLC", manager: "MR. ROWAN", coords: [38.8977, -77.0365] },
    { name: "G4S", manager: "MR. ROWAN", coords: [51.5074, -0.1278] }, // London
    { name: "Rygor Land Systems (UK MOD)", manager: "MR. ROWAN", coords: [51.3148, -2.2031] },
    { name: "TFM/SVM (S. Africa)", manager: "MR. ROWAN", coords: [-26.2041, 28.0473] },
    { name: "SMT Defence, UK", manager: "MR. ROWAN", coords: [52.4862, -1.8904] },
    { name: "US Consulate Frankfurt", manager: "MR. ROWAN", coords: [50.1109, 8.6821] },
    { name: "World Bank Group", manager: "MR. ROWAN", coords: [38.8989, -77.0439] },
    { name: "Hart International", manager: "MR. ROWAN", coords: [25.2048, 55.2708] }, // UAE/Global
    { name: "NP Aerospace", manager: "MR. ROWAN", coords: [52.4068, -1.5197] },
    { name: "US Dept of State - DSS", manager: "MR. ROWAN", coords: [38.8943, -77.0451] }, // Foggy Bottom, DC
    { name: "IDG Security (Malaysia)", manager: "MR. ROWAN", coords: [3.1390, 101.6869] },
    { name: "IOM Manila", manager: "MR. ROWAN", coords: [14.5547, 121.0244] },
    { name: "Syria - UN", manager: "MR. AZMI", coords: [33.5138, 36.2765] },
    { name: "Libya - UN", manager: "MR. AZMI", coords: [32.8872, 13.1913] },
    { name: "UNDP Yemen", manager: "MR. AZMI", coords: [15.3694, 44.1910] },
    { name: "UNOCHA", manager: "MR. AZMI", coords: [40.7505, -73.9671] }, // NYC HQ
    { name: "JICA", manager: "MR. AZMI", coords: [35.6852, 139.7298] }, // Tokyo
    { name: "Danish Refugee Council", manager: "MR. AZMI", coords: [55.6761, 12.5683] }, // Copenhagen
    { name: "IMC (Intl Medical Corps)", manager: "MR. AZMI", coords: [34.0522, -118.2437] }, // LA HQ
    { name: "World Central Kitchen", manager: "MR. AZMI", coords: [38.9072, -77.0369] }, // DC HQ
    { name: "World Vision", manager: "MR. AZMI", coords: [34.0673, -117.9211] }, // California HQ
    { name: "Czech MOD/Bank", manager: "MR. AZMI", coords: [50.0755, 14.4378] },
        { name: "UNOPS LTA", manager: "SUJITHA", coords: [55.6761, 12.5683] }
        
        
    ]
};
