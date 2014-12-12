var cars = {};
cars["abarth500"] = "Abarth 500";
cars["abarth500_s1"] = "Abarth 500 EssEss";
cars["bmw_1m"] = "BMW 1M";
cars["bmw_1m_s3"] = "BMW 1M S3";
cars["bmw_m3_e30"] = "BMW M3 E30";
cars["bmw_m3_e30_drift"] = "BMW M3 E30 Drift";
cars["bmw_m3_e30_dtm"] = "BMW M3 E30 DTM";
cars["bmw_m3_e30_gra"] = "BMW M3 E30 GRA";
cars["bmw_m3_e30_s1"] = "BMW M3 E30 S1";
cars["bmw_m3_e92"] = "BMW M3 E92";
cars["bmw_m3_e92_drift"] = "BMW M3 E92 Drift";
cars["bmw_m3_e92_s1"] = "BMW M3 E92 S1";
cars["bmw_m3_gt2"] = "BMW M3 GT2";
cars["bmw_z4"] = "BMW Z4";
cars["bmw_z4_drift"] = "BMW Z4 Drift";
cars["bmw_z4_gt3"] = "BMW Z4 GT3";
cars["bmw_z4_s1"] = "BMW Z4 S1";
cars["shelby_cobra_427sc"] = "Shelby Cobra 427 SC";
cars["ferrari_312t"] = "Ferrari 312t";
cars["ferrari_458"] = "Ferrari 458";
cars["ferrari_458_s3"] = "Ferrari 458 S3";
cars["ferrari_599xxevo"] = "Ferrari 599xx Evo";
cars["ferrari_f40"] = "Ferrari F40";
cars["ferrari_f40_s3"] = "Ferrari F40 S3";
cars["ktm_xbow_r"] = "KTM X-Bow R";
cars["lotus_2_eleven"] = "Lotus 2-11";
cars["lotus_49"] = "Lotus Type 49";
cars["lotus_elise_sc"] = "Lotus Elise SC";
cars["lotus_elise_sc_s1"] = "Lotus Elise SC S1";
cars["lotus_elise_sc_s2"] = "Lotus Elise SC S2";
cars["lotus_evora_gtc"] = "Lotus Evora GTC";
cars["lotus_evora_gte"] = "Lotus Evora GTE";
cars["lotus_evora_gx"] = "Lotus Evora GX";
cars["lotus_evora_s"] = "Lotus Evora S";
cars["lotus_evora_s_s2"] = "Lotus Evora S2";
cars["lotus_exige_240"] = "Lotus Exige 240";
cars["lotus_exige_240_s3"] = "Lotus Exige S3";
cars["lotus_exige_s_roadster"] = "Lotus Exige S Roadster";
cars["lotus_exige_scura"] = "Lotus Exige Scura";
cars["lotus_exos_125"] = "Lotus Exos T125";
cars["lotus_exos_125_s1"] = "Lotus Exos T125 S1";
cars["mclaren_mp412c"] = "McLaren MP412c";
cars["mclaren_mp412c_gt3"] = "McLaren MP412c GT3";
cars["mercedes_sls"] = "Mercedes SLS";
cars["mercedes_sls_gt3"] = "Mercedes SLS GT3";
cars["p4-5_2011"] = "P4/5 Competizione";
cars["pagani_huayra"] = "Pagani Huayra";
cars["pagani_zonda_r"] = "Pagani Zonda R";
cars["tatuusfa1"] = "Tatuus F.Abarth";

var findByName = function (name) {
    return name in cars ? cars[name] : name;
};

module.exports = {
    findByName: findByName
};
