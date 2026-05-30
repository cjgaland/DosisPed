// ============================================================
//  farmacos.js — DosisPed · Base de datos pediátrica
//  v0.1 — fármacos esenciales en urgencias, planta, UCIP y neonatos
//
//  Fuentes:
//   - Pediamécum (AEP) — referencia maestra
//   - SEUP — urgencias pediátricas
//   - Neofax / SEN — neonatos
//   - Ficha técnica AEMPS, Harriet Lane — complemento
//
//  En caso de conflicto entre fuentes prevalece Pediamécum,
//  salvo contexto de urgencias donde prevalece SEUP.
// ============================================================

const ISO = {
  analgesia:    "var(--iso-analgesia)",
  antibiotico:  "var(--iso-antibiotico)",
  respiratorio: "var(--iso-respiratorio)",
  neuro:        "var(--iso-neuro)",
  cardio:       "var(--iso-cardio)",
  digestivo:    "var(--iso-digestivo)",
  endocrino:    "var(--iso-endocrino)",
  neonatal:     "var(--iso-neonatal)",
  rea:          "var(--iso-rea)",
  neutral:      "var(--iso-neutral)"
};

const farmacos = [

  // ── A ─────────────────────────────────────────────────────
  {
    nombre: "ACICLOVIR",
    categoria: "Antivírico",
    sinonimos: ["aciclovir", "zovirax"],
    isoColor: ISO.antibiotico,
    icono: "🦠",
    vias: ["iv", "oral"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Infección herpética grave / VVZ inmunodeprimido (IV)",
        via: "iv",
        dosis_mg_kg: 10,
        intervalo_h: 8,
        dosis_max_mg: 800,
        duracion: "7-14 días según indicación",
        nota: "Pediamécum: 10 mg/kg/dosis cada 8 h en infecciones herpéticas graves y VVZ en inmunodeprimido (no encefalitis). Diluir y administrar en 1 hora. Asegurar buena hidratación (riesgo de nefrotoxicidad por cristaluria).",
        preparados: []
      },
      {
        indicacion: "Encefalitis herpética / Neonatos (IV)",
        via: "iv",
        dosis_mg_kg: 20,
        intervalo_h: 8,
        dosis_max_mg: 1200,
        duracion: "14-21 días",
        nota: "Pediamécum: 20 mg/kg/dosis cada 8 h durante 14-21 días en encefalitis herpética (< 12 años) y en infecciones por VHS en neonatos. Diluir y administrar en 1 hora. Vigilar función renal, asegurar hidratación. En ≥ 12 años: 10-15 mg/kg/dosis cada 8 h en encefalitis.",
        preparados: []
      },
      {
        indicacion: "Varicela / herpes zoster (oral)",
        via: "oral",
        dosis_mg_kg: 20,
        intervalo_h: 6,
        dosis_max_mg: 800,
        dosis_max_dia_mg: 3200,
        duracion: "5-7 días",
        nota: "Iniciar en las primeras 24-72 h de exantema. Mayor beneficio en grupos de riesgo.",
        preparados: [
          { nombre: "Aciclovir suspensión 400 mg/5 ml", conc_mg_ml: 80 }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Infecciones por VHS y VVZ moderadas-graves",
        "Encefalitis herpética (uso IV obligatorio)",
        "Varicela en inmunodeprimido o forma grave",
        "Profilaxis y tratamiento en trasplante de progenitores"
      ],
      contraindicaciones: [
        "Hipersensibilidad a aciclovir o valaciclovir"
      ],
      precauciones: [
        "Hidratación adecuada antes y durante la infusión IV",
        "Ajustar dosis en insuficiencia renal",
        "Vigilar función renal y hemograma en tratamiento prolongado",
        "Riesgo de neurotoxicidad (confusión, mioclonias) con dosis altas o insuficiencia renal"
      ]
    }
  },

  {
    nombre: "ÁCIDO FÓLICO",
    categoria: "Hematología",
    sinonimos: ["acido folico", "folato", "vitamina b9", "acfol"],
    isoColor: ISO.neutral,
    icono: "💊",
    vias: ["oral", "iv", "im"],
    modos: ["intermitente"],
    fuente: "Pediamécum",
    intermitente: [
      {
        indicacion: "Anemia megaloblástica / Déficit nutricional",
        via: "oral",
        dosis_fija_mg: 1,
        intervalo_h: 24,
        dosis_max_dia_mg: 5,
        nota: "Lactantes: 0,1 mg/día. Niños 1-10 años: 1 mg/día. > 10 años: 1-5 mg/día. Continuar 3-4 meses hasta reposición.",
        preparados: [
          { nombre: "Acfol comp. 5 mg", conc_mg_ml: null },
          { nombre: "Ácido fólico comp. 5 mg", conc_mg_ml: null }
        ]
      },
      {
        indicacion: "Profilaxis (anemia hemolítica crónica, MTX, antiepilépticos)",
        via: "oral",
        dosis_fija_mg: 5,
        intervalo_h: 168,
        nota: "5 mg/semana en pacientes con metotrexato o tratamiento antiepiléptico crónico (fenitoína, valproato). En anemias hemolíticas crónicas: 1-5 mg/día.",
        preparados: [
          { nombre: "Acfol comp. 5 mg", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Anemia megaloblástica por déficit de folato",
        "Profilaxis en pacientes con anemias hemolíticas crónicas",
        "Profilaxis del déficit en tratamientos prolongados con metotrexato o antiepilépticos",
        "Prevención de defectos del tubo neural (en gestación, no aplicable aquí)"
      ],
      contraindicaciones: [
        "Hipersensibilidad",
        "Anemia perniciosa no tratada (puede enmascarar déficit de B12)"
      ],
      precauciones: [
        "Descartar déficit de B12 antes de iniciar tratamiento prolongado",
        "Muy bien tolerado; efectos adversos raros",
        "No reemplaza el tratamiento etiológico de la anemia"
      ]
    }
  },

  {
    nombre: "ÁCIDO FUSÍDICO TÓPICO",
    categoria: "Dermatología",
    sinonimos: ["acido fusidico", "fucidine", "fucidin"],
    isoColor: ISO.antibiotico,
    icono: "🧴",
    vias: ["top"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Impétigo / Infecciones cutáneas superficiales",
        via: "top",
        dosis_fija_mg: 0,
        intervalo_h: 8,
        duracion: "7 días (máx. 10 días)",
        nota: "Crema o pomada al 2%. Aplicar capa fina sobre la lesión limpia y seca 2-3 veces al día durante 7 días. Cubrir o no según preferencia. No prolongar más de 10 días para evitar resistencias. Alternativa a mupirocina; cubre S. aureus (incluido SARM en algunos centros) y estreptococo.",
        preparados: [
          { nombre: "Fucidine crema 20 mg/g (2%)", conc_mg_ml: null },
          { nombre: "Fucidine pomada 20 mg/g (2%)", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Impétigo no extenso (alternativa a mupirocina)",
        "Foliculitis y otras infecciones superficiales",
        "Eccema impetiginizado",
        "Descolonización nasal de S. aureus (uso seleccionado)"
      ],
      contraindicaciones: [
        "Hipersensibilidad al ácido fusídico"
      ],
      precauciones: [
        "Resistencias crecientes a S. aureus por uso indiscriminado: limitar a 7-10 días",
        "Irritación local leve, dermatitis de contacto poco frecuente",
        "Evitar contacto con ojos y mucosas",
        "En infecciones extensas, recurrentes o profundas: tratamiento sistémico"
      ]
    }
  },

  {
    nombre: "ÁCIDO TRANEXÁMICO",
    categoria: "Hematología",
    sinonimos: ["amchafibrin", "acido tranexamico", "tranexamico"],
    isoColor: ISO.neutral,
    icono: "💉",
    vias: ["iv", "oral", "top"],
    modos: ["intermitente", "puntual"],
    fuente: "Pediamécum (AEP)",
    puntual: {
      descripcion: "Hemorragia aguda / Traumatismo grave (protocolo tipo CRASH-2)",
      dosis_mg_kg: 15,
      dosis_max_mg: 1000,
      via: "IV en 10 min, después perfusión",
      nota: "Antifibrinolítico. Hemorragia traumática grave: carga 15-20 mg/kg (máx. 1 g) IV en 10 min, seguido de 2 mg/kg/h (o 1 g en 8 h) en perfusión. Iniciar en las primeras 3 h del traumatismo. En hemorragia quirúrgica: 10-15 mg/kg previo a la incisión."
    },
    intermitente: [
      {
        indicacion: "Epistaxis / Sangrado mucoso / Menorragia",
        via: "oral",
        dosis_mg_kg: 20,
        intervalo_h: 8,
        dosis_max_mg: 1500,
        duracion: "Según sangrado (menorragia: 3-5 días)",
        nota: "15-25 mg/kg/dosis cada 8 h (máx. 1,5 g/dosis). Epistaxis recurrente, sangrado mucoso, menorragia en adolescentes, sangrado en enfermedad de von Willebrand o trombopatías. Aplicación tópica en epistaxis: empapar una torunda con la solución inyectable (100 mg/ml) y aplicar en la fosa.",
        preparados: [
          { nombre: "Amchafibrin comprimidos 500 mg", conc_mg_ml: null },
          { nombre: "Amchafibrin ampolla 500 mg/5 ml (100 mg/ml) — IV, oral o tópico", conc_mg_ml: 100 }
        ]
      },
      {
        indicacion: "Profilaxis de sangrado en procedimientos (IV)",
        via: "iv",
        dosis_mg_kg: 10,
        intervalo_h: 8,
        dosis_max_mg: 1000,
        nota: "10 mg/kg/dosis cada 6-8 h IV (máx. 1 g/dosis). Profilaxis perioperatoria en cirugía con riesgo hemorrágico (cardíaca, ORL, dental en coagulopatías). Administrar lento (riesgo de hipotensión y mareo con infusión rápida)."
      }
    ],
    info: {
      indicaciones: [
        "Hemorragia traumática grave (protocolo CRASH-2, primeras 3 h)",
        "Epistaxis recurrente o grave",
        "Menorragia en adolescentes",
        "Sangrado en coagulopatías (von Willebrand, trombopatías, hemofilia con factor)",
        "Profilaxis de sangrado perioperatorio"
      ],
      contraindicaciones: [
        "Antecedente de enfermedad tromboembólica (TVP, TEP)",
        "Coagulación intravascular activa",
        "Insuficiencia renal grave (ajustar dosis)",
        "Hematuria de origen en vías altas (riesgo de obstrucción por coágulos)",
        "Convulsiones (relativa; descritas con dosis altas IV)"
      ],
      precauciones: [
        "Riesgo trombótico — valorar antecedentes personales y familiares",
        "Convulsiones con dosis altas IV (especialmente en cirugía cardíaca)",
        "Ajuste de dosis en insuficiencia renal",
        "Administrar IV lento (hipotensión, mareo con bolo rápido)",
        "Náuseas, vómitos y diarrea con la vía oral"
      ]
    }
  },

  {
    nombre: "ADENOSINA",
    categoria: "Reanimación / UCIP",
    sinonimos: ["adenocor", "adenosina"],
    isoColor: ISO.cardio,
    icono: "⚡",
    vias: ["iv", "io"],
    modos: ["puntual"],
    fuente: "SEUP / Pediamécum",
    puntual: {
      descripcion: "Taquicardia supraventricular (TSV) estable",
      dosis_mg_kg: 0.1,
      dosis_max_mg: 6,
      via: "IV/IO en bolo rápido por vía más proximal posible, seguido de bolo de 5-10 ml de SSF a presión.",
      nota: "Primera dosis 0,1 mg/kg (máx. 6 mg). Si no respuesta: segunda dosis 0,2 mg/kg (máx. 12 mg) y tercera 0,3 mg/kg (máx. 12 mg). Vida media muy corta (< 10 s): administrar tan rápido como sea posible. Monitorizar ECG. Avisar al paciente: sensación pasajera de muerte inminente."
    },
    info: {
      indicaciones: [
        "Taquicardia supraventricular paroxística por reentrada nodal (primera línea farmacológica si estable)",
        "Maniobra diagnóstica en taquicardias de QRS estrecho"
      ],
      contraindicaciones: [
        "Bloqueo AV de 2.º-3.er grado sin marcapasos",
        "Síndrome de QT largo",
        "Asma grave activo (broncoespasmo)",
        "Síndrome del seno enfermo sin marcapasos"
      ],
      precauciones: [
        "Broncoespasmo — precaución en asmáticos",
        "Pausa sinusal transitoria, asistolia breve esperable",
        "Síndrome de preexcitación (WPW) con FA: puede acelerar respuesta ventricular — contraindicada",
        "Disponer siempre de carro de paradas y desfibrilador"
      ]
    }
  },

  {
    nombre: "ADRENALINA",
    categoria: "Reanimación / UCIP",
    sinonimos: ["epinefrina", "adrenalina"],
    isoColor: ISO.rea,
    icono: "💉",
    vias: ["iv", "im", "io", "neb"],
    modos: ["puntual", "perfusion"],
    fuente: "SEUP / Pediamécum",
    puntual: {
      descripcion: "PCR / Anafilaxia grave / Laringitis grave",
      dosis_mg_kg: 0.01,
      dosis_max_mg: 1,
      via: "IV/IO 0,01 mg/kg cada 3-5 min en PCR. IM 0,01 mg/kg en anafilaxia (máx. 0,5 mg) en cara anterolateral del muslo.",
      nota: "Anafilaxia: repetir cada 5-15 min si no respuesta. Laringitis moderada-grave: nebulización 0,5 mg/kg de adrenalina 1:1000 (máx. 5 mg) diluida en 3 ml SSF."
    },
    presentaciones: [
      {
        label: "1 mg / 50 ml SG5% (UCIP concentrada)",
        dosis_mg: 1, dilucion_ml: 50, suero: "Dx5%",
        concUgMl: (1 * 1000) / 50,             // 20 mcg/ml
        dosisRange: "0,05 – 1 mcg/kg/min",
        dosisMin: 0.05, softMax: 1, hardMax: 2,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      },
      {
        label: "1 mg / 100 ml SG5%",
        dosis_mg: 1, dilucion_ml: 100, suero: "Dx5%",
        concUgMl: (1 * 1000) / 100,            // 10 mcg/ml
        dosisRange: "0,05 – 1 mcg/kg/min",
        dosisMin: 0.05, softMax: 1, hardMax: 2,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      }
    ],
    info: {
      indicaciones: [
        "Parada cardiorrespiratoria pediátrica (IV/IO)",
        "Anafilaxia (primera línea, vía IM)",
        "Crup/laringitis moderada-grave (nebulizada)",
        "Shock refractario en UCIP (perfusión continua)"
      ],
      contraindicaciones: [
        "No tiene contraindicaciones absolutas en situaciones de riesgo vital"
      ],
      precauciones: [
        "Vía central para perfusión continua (riesgo de necrosis por extravasación)",
        "Monitorización ECG y PA continua en perfusión",
        "Taquiarritmias e isquemia a dosis altas",
        "Evitar uso simultáneo con bicarbonato en misma vía"
      ]
    }
  },

  {
    nombre: "ALBENDAZOL",
    categoria: "Antibiótico",
    sinonimos: ["eskazole", "albendazol"],
    isoColor: ISO.antibiotico,
    icono: "💊",
    vias: ["oral"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Oxiuriasis (enterobiasis)",
        via: "oral",
        dosis_fija_mg: 400,
        intervalo_h: 336,
        duracion: "Dosis única, repetir a las 2 semanas",
        nota: "1-2 años: 200 mg dosis única. ≥ 2 años: 400 mg dosis única. Repetir a las 2 semanas para eliminar reinfecciones por huevos. Tratar simultáneamente a todos los convivientes y reforzar medidas higiénicas: lavado de manos, uñas cortas, ropa interior y sábanas a > 60 ºC. Tomar con alimentos grasos para aumentar absorción.",
        preparados: [
          { nombre: "Eskazole comprimidos 400 mg", conc_mg_ml: null },
          { nombre: "Eskazole suspensión 100 mg/5 ml (20 mg/ml)", conc_mg_ml: 20 }
        ]
      },
      {
        indicacion: "Larva migrans cutánea / Ascariasis / Tricuriasis / Anquilostomiasis",
        via: "oral",
        dosis_fija_mg: 400,
        intervalo_h: 24,
        duracion: "3 días (larva migrans, ascariasis: 1-3 días; tricuriasis: 3 días)",
        nota: "≥ 2 años: 400 mg/día durante 3 días en parasitosis intestinales por nematodos. Larva migrans cutánea: 400 mg/día × 3-7 días. Strongyloides: 400 mg c/12 h × 3 días. Tomar con alimentos grasos.",
        preparados: [
          { nombre: "Eskazole comprimidos 400 mg", conc_mg_ml: null },
          { nombre: "Eskazole suspensión 100 mg/5 ml (20 mg/ml)", conc_mg_ml: 20 }
        ]
      },
      {
        indicacion: "Hidatidosis (E. granulosus / E. multilocularis)",
        via: "oral",
        dosis_mg_kg_dia: 10,
        intervalo_h: 12,
        dosis_max_dia_mg: 800,
        duracion: "Ciclos de 28 días, repetir según protocolo",
        nota: "10-15 mg/kg/día divididos cada 12 h (máx. 800 mg/día). Ciclos de 28 días con 14 días de descanso, durante 3-6 meses o más según localización y respuesta. Bajo supervisión especializada. Monitorizar hemograma y transaminasas en cada ciclo."
      }
    ],
    info: {
      indicaciones: [
        "Oxiuriasis (enterobiasis) — primera línea junto con mebendazol",
        "Ascariasis, tricuriasis, anquilostomiasis",
        "Larva migrans cutánea (incluye 'creeping eruption')",
        "Estrongiloidiasis",
        "Hidatidosis (E. granulosus, E. multilocularis) — uso especializado",
        "Neurocisticercosis (uso especializado, con corticoide)"
      ],
      contraindicaciones: [
        "< 1 año (datos limitados; valorar mebendazol)",
        "Embarazo (primer trimestre)",
        "Hipersensibilidad a benzimidazoles",
        "Insuficiencia hepática grave"
      ],
      precauciones: [
        "Hepatotoxicidad — vigilar transaminasas en tratamientos prolongados",
        "Mielosupresión (leucopenia, pancitopenia) en tratamientos prolongados — hemograma cada 2-4 semanas",
        "Dolor abdominal, cefalea, náuseas, alopecia reversible",
        "Reacciones tipo Mazzotti en neurocisticercosis (cubrir con corticoide)",
        "Tomar con alimentos grasos para mejorar absorción"
      ]
    }
  },

  {
    nombre: "AMLODIPINO",
    categoria: "Cardiología",
    sinonimos: ["amlodipino", "norvas", "astudal"],
    isoColor: ISO.cardio,
    icono: "💊",
    vias: ["oral"],
    modos: ["intermitente"],
    fuente: "Pediamécum",
    intermitente: [
      {
        indicacion: "HTA pediátrica crónica",
        via: "oral",
        dosis_mg_kg: 0.1,
        intervalo_h: 24,
        dosis_max_mg: 10,
        nota: "Iniciar 0,05-0,1 mg/kg/día en 1 toma (máx. 5 mg/día inicial). Titular cada 1-2 sem hasta 0,6 mg/kg/día (máx. 10 mg/día). Inicio del efecto en 1-2 sem (acción gradual). Bien tolerado, alternativa a IECA cuando éstos no se pueden usar.",
        preparados: [
          { nombre: "Amlodipino comp. 5 / 10 mg", conc_mg_ml: null },
          { nombre: "Amlodipino fórmula magistral susp. 1 mg/ml", conc_mg_ml: 1 }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Hipertensión arterial pediátrica esencial o secundaria",
        "HTA refractaria a IECA o ARA-II",
        "Vasoespasmo coronario / Raynaud (uso poco frecuente en pediatría)"
      ],
      contraindicaciones: [
        "Hipersensibilidad a dihidropiridinas",
        "Shock cardiogénico",
        "Estenosis aórtica grave"
      ],
      precauciones: [
        "Edemas maleolares frecuentes (no relacionados con balance hídrico — no responden a diuréticos)",
        "Rubor, cefalea, palpitaciones",
        "Hipertrofia gingival (similar a antiepilépticos)",
        "Ajuste innecesario en insuficiencia renal moderada"
      ]
    }
  },

  {
    nombre: "AMOXICILINA",
    categoria: "Antibiótico",
    sinonimos: ["amoxicilina", "amoxi"],
    isoColor: ISO.antibiotico,
    icono: "💊",
    vias: ["oral", "iv"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP) · SEUP",
    intermitente: [
      {
        indicacion: "OMA, faringoamigdalitis, ITU",
        via: "oral",
        dosis_mg_kg_dia: 50,
        intervalo_h: 8,
        dosis_max_dia_mg: 3000,
        duracion: "5-10 días según indicación",
        nota: "Faringoamigdalitis estreptocócica: 50 mg/kg/día c/12-24 h × 10 días (alternativa: 1 dosis diaria). OMA: 80-90 mg/kg/día si < 2 años o riesgo de neumococo resistente.",
        preparados: [
          { nombre: "Amoxicilina susp. 250 mg/5 ml", conc_mg_ml: 50 },
          { nombre: "Amoxicilina susp. 500 mg/5 ml", conc_mg_ml: 100 },
          { nombre: "Amoxicilina susp. 100 mg/ml (gotas)", conc_mg_ml: 100 }
        ]
      },
      {
        indicacion: "OMA / Neumonía típica (dosis altas)",
        via: "oral",
        dosis_mg_kg_dia: 80,
        intervalo_h: 8,
        dosis_max_dia_mg: 3000,
        duracion: "5-7 días (neumonía 7 días)",
        nota: "Dosis altas indicadas en OMA recidivante, < 2 años, o riesgo de neumococo resistente. Neumonía típica adquirida en comunidad: primera línea.",
        preparados: [
          { nombre: "Amoxicilina susp. 250 mg/5 ml", conc_mg_ml: 50 },
          { nombre: "Amoxicilina susp. 500 mg/5 ml", conc_mg_ml: 100 }
        ]
      },
      {
        indicacion: "Infección moderada-grave IV",
        via: "iv",
        dosis_mg_kg_dia: 100,
        intervalo_h: 8,
        dosis_max_dia_mg: 6000,
        nota: "Pediamécum: 100 mg/kg/día divididos cada 6-8 h en infecciones moderadas-graves IV. En infecciones graves (sepsis, neumonía complicada) puede aumentarse a 150-200 mg/kg/día divididos cada 4-6 h (consultar protocolos locales). Diluir y administrar en 30 min. NO es de elección en meningitis (usar cefotaxima/ceftriaxona).",
        preparados: []
      }
    ],
    info: {
      indicaciones: [
        "Otitis media aguda",
        "Faringoamigdalitis estreptocócica",
        "Neumonía adquirida en la comunidad (forma típica)",
        "Infección urinaria en lactantes (según antibiograma)",
        "Profilaxis de endocarditis"
      ],
      contraindicaciones: [
        "Alergia a betalactámicos (especialmente penicilinas) tipo I",
        "Mononucleosis infecciosa (riesgo de exantema)"
      ],
      precauciones: [
        "Exantema tardío frecuente (no siempre alergia verdadera)",
        "Ajustar dosis en insuficiencia renal grave",
        "Diarrea por alteración de microbiota; raro: C. difficile",
        "Reactividad cruzada con cefalosporinas: revisar antecedentes"
      ]
    }
  },

  {
    nombre: "AMOXICILINA / CLAVULÁNICO",
    categoria: "Antibiótico",
    sinonimos: ["augmentine", "amoxi-clavulanico", "amoxiclavulanico"],
    isoColor: ISO.antibiotico,
    icono: "💊",
    vias: ["oral", "iv"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP) · SEUP",
    intermitente: [
      {
        indicacion: "OMA refractaria / Sinusitis / Mordeduras",
        via: "oral",
        dosis_mg_kg_dia: 80,
        intervalo_h: 8,
        dosis_max_dia_mg: 3000,
        duracion: "7-10 días",
        nota: "La dosis se refiere al componente amoxicilina. Usar formulación 8:1 o 7:1 para minimizar diarrea. Indicado en OMA refractaria, sinusitis aguda bacteriana, mordeduras, abscesos dentarios.",
        preparados: [
          { nombre: "Augmentine susp. 100/12,5 mg/ml", conc_mg_ml: 100 },
          { nombre: "Augmentine susp. 250/62,5 mg/5 ml", conc_mg_ml: 50 },
          { nombre: "Augmentine susp. 500/125 mg/5 ml", conc_mg_ml: 100 }
        ]
      },
      {
        indicacion: "Infección moderada-grave IV",
        via: "iv",
        dosis_mg_kg_dia: 100,
        intervalo_h: 8,
        dosis_max_dia_mg: 6000,
        nota: "Pediamécum: 100 mg/kg/día (expresados en componente amoxicilina) divididos cada 6-8 h, máx. 6 g/día. En infecciones graves puede aumentarse a 150 mg/kg/día divididos cada 6 h. Administrar en 30-40 min. Relación amoxicilina:clavulánico 10:1 en presentación IV."
      }
    ],
    info: {
      indicaciones: [
        "OMA refractaria o complicada",
        "Sinusitis aguda bacteriana",
        "Neumonía complicada / aspirativa",
        "Mordeduras (humanas y animales)",
        "Infecciones de piel y partes blandas"
      ],
      contraindicaciones: [
        "Alergia a betalactámicos tipo I",
        "Antecedente de hepatitis colestásica con amoxi-clavulánico"
      ],
      precauciones: [
        "Diarrea muy frecuente (relacionada con el clavulánico)",
        "Hepatitis colestásica idiosincrásica rara",
        "Tomar con las comidas para mejorar tolerancia",
        "Ajustar dosis en insuficiencia renal moderada-grave"
      ]
    }
  },

  {
    nombre: "AMIODARONA",
    categoria: "Reanimación / UCIP",
    sinonimos: ["trangorex", "amiodarona"],
    isoColor: ISO.cardio,
    icono: "⚡",
    vias: ["iv", "io"],
    modos: ["puntual", "carga_mantenimiento"],
    fuente: "SEUP / Pediamécum",
    puntual: {
      descripcion: "FV / TV sin pulso (PCR)",
      dosis_mg_kg: 5,
      dosis_max_mg: 300,
      via: "IV/IO en bolo durante PCR, sin diluir.",
      nota: "Tras la 3.ª descarga en FV/TVSP refractaria: 5 mg/kg (máx. 300 mg) en bolo. Puede repetirse hasta 2 veces más. Fuera de PCR: diluir en SG5% y administrar en 20-60 min."
    },
    carga: {
      descripcion: "Taquicardias supraventriculares y ventriculares con pulso",
      dosis_mg_kg: 5,
      tiempo_min: 60,
      via: "IV en 20-60 min, diluido en SG5% (preferiblemente por vía central)",
      nota: "Carga 5 mg/kg en 20-60 min. Mantenimiento: 10-15 mg/kg/día en perfusión continua. Monitorización continua de ECG y TA (hipotensión durante la carga)."
    },
    info: {
      indicaciones: [
        "FV/TV sin pulso refractaria a descargas (PCR pediátrica)",
        "Taquicardia ventricular con pulso",
        "Taquicardias supraventriculares no controlables (TSV refractaria, JET postoperatorio)"
      ],
      contraindicaciones: [
        "Bloqueo AV 2.º-3.er grado sin marcapasos",
        "Disfunción tiroidea grave activa",
        "Alergia al yodo o a la amiodarona",
        "QTc prolongado en ausencia de PCR"
      ],
      precauciones: [
        "Riesgo de flebitis severa en vía periférica — preferir vía central",
        "Hipotensión durante la carga IV",
        "Múltiples interacciones farmacológicas (digoxina, warfarina)",
        "Toxicidad pulmonar, hepática y tiroidea con uso prolongado: vigilar"
      ]
    }
  },

  {
    nombre: "AZITROMICINA",
    categoria: "Antibiótico",
    sinonimos: ["zitromax", "azitromicina"],
    isoColor: ISO.antibiotico,
    icono: "💊",
    vias: ["oral", "iv"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Pauta estándar 3 días",
        via: "oral",
        dosis_mg_kg: 10,
        intervalo_h: 24,
        dosis_max_mg: 500,
        duracion: "3 días",
        nota: "Indicada en neumonía atípica, tos ferina y como alternativa en alérgicos a betalactámicos. Tomar con el estómago vacío (1 h antes o 2 h después).",
        preparados: [
          { nombre: "Azitromicina susp. 200 mg/5 ml", conc_mg_ml: 40 },
          { nombre: "Azitromicina susp. 40 mg/ml", conc_mg_ml: 40 }
        ]
      },
      {
        indicacion: "Pauta estándar 5 días",
        via: "oral",
        dosis_mg_kg: 10,
        intervalo_h: 24,
        dosis_max_mg: 500,
        duracion: "1.er día 10 mg/kg, después 5 mg/kg × 4 días",
        nota: "Pauta clásica 5 días: 10 mg/kg el día 1, luego 5 mg/kg/día (máx. 250 mg) durante 4 días.",
        preparados: [
          { nombre: "Azitromicina susp. 200 mg/5 ml", conc_mg_ml: 40 }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Neumonía atípica (Mycoplasma, Chlamydia)",
        "Tos ferina (prevención y tratamiento)",
        "Faringoamigdalitis o OMA en alérgicos a betalactámicos",
        "Infecciones por Campylobacter, Bartonella"
      ],
      contraindicaciones: [
        "Hipersensibilidad a macrólidos",
        "Antecedente de hepatopatía con macrólidos",
        "QTc prolongado"
      ],
      precauciones: [
        "Prolonga QTc — precaución con otros fármacos que lo prolongan",
        "Estenosis hipertrófica del píloro en lactantes < 6 sem (asociación descrita)",
        "Hepatotoxicidad infrecuente",
        "Resistencias crecientes a macrólidos: no usar empíricamente sin indicación clara"
      ]
    }
  },

  {
    nombre: "AZITROMICINA OFTÁLMICA",
    categoria: "Oftalmología",
    sinonimos: ["azydrop", "azitromicina oftalmica", "azitromicina colirio"],
    isoColor: ISO.antibiotico,
    icono: "👁️",
    vias: ["oft"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Conjuntivitis bacteriana — pauta corta",
        via: "oft",
        dosis_fija_mg: 0,
        intervalo_h: 12,
        duracion: "3 días",
        nota: "Azitromicina colirio 15 mg/g (monodosis). 1 gota en cada ojo afecto cada 12 h durante 3 días. Pauta corta cómoda. Indicado en conjuntivitis bacteriana en niños ≥ 1 año y adultos. Mantener la monodosis en frigorífico tras abrir y desechar a las 24 h.",
        preparados: [
          { nombre: "Azydrop colirio 15 mg/g (monodosis 0,25 g)", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Conjuntivitis bacteriana purulenta en ≥ 1 año",
        "Conjuntivitis por Chlamydia trachomatis (alternativa local en formas leves)",
        "Tracoma (en zonas endémicas)"
      ],
      contraindicaciones: [
        "Hipersensibilidad a macrólidos",
        "< 1 año (datos limitados)"
      ],
      precauciones: [
        "Sensación de escozor transitoria al instilar",
        "No usar lentes de contacto durante el tratamiento",
        "Si no mejora en 3 días: reevaluar diagnóstico (vírica, alérgica, herpética)",
        "Sin efecto sobre conjuntivitis víricas (las más frecuentes en pediatría)"
      ]
    }
  },

  {
    nombre: "ANFOTERICINA B",
    categoria: "Antibiótico",
    sinonimos: ["anfotericina", "ambisome", "amphocil", "fungizone"],
    isoColor: ISO.antibiotico,
    icono: "🦠",
    vias: ["iv"],
    modos: ["intermitente"],
    fuente: "Pediamécum",
    intermitente: [
      {
        indicacion: "Infección fúngica invasiva — formulación liposomal (AmBisome)",
        via: "iv",
        dosis_mg_kg: 3,
        intervalo_h: 24,
        nota: "Formulación liposomal: 3-5 mg/kg/día IV en 1-2 h. Mejor perfil renal y tolerancia que el desoxicolato. Indicada en candidiasis invasiva, aspergilosis, criptococosis, leishmaniasis. Infusión en 2 h con monitor (reacción infusional).",
        preparados: []
      },
      {
        indicacion: "Formulación desoxicolato (Fungizone) — uso limitado",
        via: "iv",
        dosis_mg_kg: 1,
        intervalo_h: 24,
        nota: "Desoxicolato: 0,25 mg/kg/día con escalada hasta 1-1,5 mg/kg/día. Mayor nefrotoxicidad y reacciones infusionales. Premedicar con paracetamol +/- antihistamínico +/- hidrocortisona. Diluir en G5%, NO en SSF (precipita)."
      }
    ],
    info: {
      indicaciones: [
        "Candidiasis invasiva y candidemia",
        "Aspergilosis invasiva",
        "Criptococosis (meningoencefalitis)",
        "Leishmaniasis visceral",
        "Tratamiento empírico en neutropenia febril refractaria a antibióticos"
      ],
      contraindicaciones: [
        "Hipersensibilidad a anfotericina"
      ],
      precauciones: [
        "Nefrotoxicidad significativa — especialmente con desoxicolato; vigilar creatinina, K+, Mg2+",
        "Reacciones infusionales: fiebre, escalofríos, broncoespasmo — premedicar",
        "Hipopotasemia, hipomagnesemia (suplementar)",
        "La forma liposomal (AmBisome) reduce nefrotoxicidad pero es más costosa"
      ]
    }
  },

  {
    nombre: "ATROPINA",
    categoria: "Reanimación / UCIP",
    sinonimos: ["atropina"],
    isoColor: ISO.cardio,
    icono: "💉",
    vias: ["iv", "io", "im"],
    modos: ["puntual"],
    fuente: "SEUP",
    puntual: {
      descripcion: "Bradicardia sintomática / Premedicación / Intoxicación colinérgica",
      dosis_mg_kg: 0.02,
      dosis_max_mg: 0.5,
      via: "IV/IO/IM",
      nota: "Bradicardia: 0,02 mg/kg/dosis (mínimo 0,1 mg para evitar bradicardia paradójica; máx. 0,5 mg en niño y 1 mg en adolescente). Puede repetirse a los 5 min. Premedicación previa a ketamina/intubación: 0,01-0,02 mg/kg. Intoxicación organofosforados: 0,05 mg/kg, doblar dosis cada 5 min hasta atropinización."
    },
    info: {
      indicaciones: [
        "Bradicardia sintomática vagal o tras intubación",
        "Premedicación previa a intubación o ketamina (reducción de secreciones)",
        "Intoxicación por organofosforados, carbamatos y muscarínicos",
        "Bloqueo AV 2.º-3.er grado (medida puente)"
      ],
      contraindicaciones: [
        "Glaucoma de ángulo cerrado",
        "Taquiarritmias (relativa)"
      ],
      precauciones: [
        "Dosis < 0,1 mg → bradicardia paradójica (efecto vagal central)",
        "Sequedad de boca, midriasis, taquicardia, retención urinaria",
        "Hipertermia en climas cálidos (anhidrosis)"
      ]
    }
  },

  // ── B ─────────────────────────────────────────────────────
  {
    nombre: "BICARBONATO SÓDICO 1M",
    categoria: "Reanimación / UCIP",
    sinonimos: ["bicarbonato", "bicarbonato sodico", "bicarbonato 1m"],
    isoColor: ISO.rea,
    icono: "⚗️",
    vias: ["iv", "io"],
    modos: ["puntual"],
    fuente: "SEUP / Pediamécum",
    puntual: {
      descripcion: "Acidosis metabólica grave / Hiperpotasemia con cambios ECG / Intoxicaciones específicas",
      dosis_mg_kg: 84,
      via: "IV lenta (en 1-2 min en parada; en 30 min fuera de parada). Diluir 1:1 con SG5% si vía periférica para reducir osmolaridad.",
      nota: "1 mEq/kg = 1 mL/kg de bicarbonato 1M (= 84 mg/kg). Máx. 50 mEq/dosis (50 mL). En PCR: NO uso rutinario; considerar si parada prolongada con acidosis confirmada, hiperpotasemia o intoxicación por antidepresivos tricíclicos. Corrección de acidosis fuera de PCR: déficit de bicarbonato (mEq) = 0,3 × peso × EB. Reponer ½ déficit lentamente. En neonatos: usar 1/2 M (4,2%) o diluir 1:1 para reducir riesgo de hemorragia intraventricular."
    },
    info: {
      indicaciones: [
        "PCR refractaria con acidosis confirmada, hiperpotasemia o intoxicación por antidepresivos tricíclicos",
        "Acidosis metabólica grave (pH < 7,1) con compromiso hemodinámico",
        "Hiperpotasemia grave con cambios ECG",
        "Intoxicación por antidepresivos tricíclicos (alcalinización plasmática)",
        "Intoxicación por salicilatos (alcalinización urinaria)"
      ],
      contraindicaciones: [
        "Alcalosis metabólica o respiratoria",
        "Hipernatremia",
        "Hipocloremia, hipopotasemia, hipocalcemia significativas sin corrección concomitante"
      ],
      precauciones: [
        "Hiperosmolaridad: en neonatos y lactantes pequeños diluir y administrar lento",
        "No mezclar en misma vía con calcio (precipitación), adrenalina (inactivación), dopamina o atropina",
        "Riesgo de hemorragia intraventricular en prematuros con bolos rápidos",
        "Vigilar pH, Na+, K+, Ca2+ post-infusión"
      ]
    }
  },

  {
    nombre: "BROMURO DE IPRATROPIO",
    categoria: "Respiratorio",
    sinonimos: ["ipratropio", "atrovent"],
    isoColor: ISO.respiratorio,
    icono: "🌬️",
    vias: ["neb"],
    modos: ["intermitente"],
    fuente: "SEUP",
    intermitente: [
      {
        indicacion: "Crisis asmática moderada-grave — combinado con salbutamol",
        via: "neb",
        dosis_fija_mg: 0.25,
        intervalo_h: 6,
        nota: "< 6 años (< 20 kg): 250 mcg/dosis. > 6 años: 250-500 mcg/dosis. Nebulización combinada con salbutamol cada 20 min × 3 dosis en la primera hora si crisis moderada-grave. Después según respuesta cada 4-6 h. Aporta beneficio limitado en crisis leves. Cámara espaciadora: 2-4 puffs de Atrovent 20 mcg/puff.",
        preparados: [
          { nombre: "Atrovent monodosis 250 mcg/2 ml (125 mcg/ml)", conc_mg_ml: 0.125 },
          { nombre: "Atrovent monodosis 500 mcg/2 ml (250 mcg/ml)", conc_mg_ml: 0.25 },
          { nombre: "Atrovent MDI 20 mcg/puff (con cámara)", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Crisis asmática moderada-grave (combinado con β2 agonista en la 1.ª hora)",
        "Bronquiolitis con sospecha de broncoespasmo (uso individualizado, no rutinario)",
        "Rinorrea profusa (uso intranasal, menos habitual)"
      ],
      contraindicaciones: [
        "Hipersensibilidad a atropina o derivados",
        "Glaucoma de ángulo cerrado (uso nebulizado puede precipitar crisis si mal sellado)"
      ],
      precauciones: [
        "Boca seca, sabor metálico",
        "Midriasis si entra en contacto con los ojos: usar mascarilla ajustada o boquilla en niños",
        "Beneficio limitado a la primera hora de la crisis (sumar a salbutamol); después poca evidencia",
        "Sin papel demostrado en bronquiolitis"
      ]
    }
  },

  {
    nombre: "BUDESONIDA",
    categoria: "Respiratorio",
    sinonimos: ["budesonida", "pulmicort"],
    isoColor: ISO.respiratorio,
    icono: "🌬️",
    vias: ["neb", "oral"],
    modos: ["intermitente"],
    fuente: "Pediamécum / SEUP",
    intermitente: [
      {
        indicacion: "Laringitis aguda (crup) — alternativa a dexametasona",
        via: "neb",
        dosis_fija_mg: 2,
        intervalo_h: 24,
        nota: "Dosis única de 2 mg nebulizada con 3-4 ml de SSF. Útil como alternativa o complemento a dexametasona oral (preferida 0,15-0,6 mg/kg)."
      },
      {
        indicacion: "Asma exacerbación / Bronquiolitis (uso controvertido)",
        via: "neb",
        dosis_fija_mg: 0.5,
        intervalo_h: 12,
        nota: "0,25-0,5 mg cada 12 h nebulizado. El uso en bronquiolitis no está respaldado por la mayoría de guías; valorar caso por caso."
      }
    ],
    info: {
      indicaciones: [
        "Crup moderado-grave (nebulizada)",
        "Asma: tratamiento de mantenimiento (inhalada)",
        "Como alternativa a dexametasona oral cuando hay vómitos"
      ],
      contraindicaciones: [
        "Hipersensibilidad al fármaco o al vehículo"
      ],
      precauciones: [
        "Candidiasis orofaríngea con uso inhalado prolongado: enjuagar la boca",
        "Disfonía local",
        "Supresión suprarrenal con dosis altas prolongadas"
      ]
    }
  },

  // ── C ─────────────────────────────────────────────────────
  {
    nombre: "CAFEÍNA CITRATO",
    categoria: "Neonatos",
    sinonimos: ["cafeina", "citrato cafeina", "peyona"],
    isoColor: ISO.neonatal,
    icono: "👶",
    vias: ["iv", "oral"],
    modos: ["carga_mantenimiento"],
    fuente: "Neofax / SEN",
    carga: {
      descripcion: "Apnea del prematuro — Dosis de carga",
      dosis_mg_kg: 20,
      tiempo_min: 30,
      via: "IV en 30 min, diluido en SG5% (o vía oral)",
      nota: "Dosis expresada en citrato de cafeína (10 mg/ml). Equivalencia: 20 mg/kg citrato = 10 mg/kg cafeína base. Mantenimiento: 5-10 mg/kg/24 h iniciado 24 h después de la carga. Vigilar taquicardia, intolerancia digestiva. Niveles séricos no requeridos habitualmente."
    },
    intermitente: [
      {
        indicacion: "Mantenimiento — apnea del prematuro",
        via: "iv",
        dosis_mg_kg: 5,
        intervalo_h: 24,
        nota: "5-10 mg/kg/24 h. Iniciar 24 h tras dosis de carga. Continuar hasta 33-34 semanas de edad postmenstrual o resolución de las apneas durante > 5-7 días.",
        preparados: [
          { nombre: "Peyona 20 mg/ml (cafeína citrato)", conc_mg_ml: 20 }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Apnea de la prematuridad (primera elección)",
        "Facilitación de la extubación en prematuros",
        "Profilaxis de displasia broncopulmonar (mejora neurodesarrollo)"
      ],
      contraindicaciones: [
        "Hipersensibilidad a cafeína"
      ],
      precauciones: [
        "Taquicardia, irritabilidad, intolerancia alimentaria",
        "Vigilar diuresis aumentada",
        "Acumulación en hepatopatía o insuficiencia renal: ajustar dosis",
        "Interacción con teofilina (sumar efectos): no combinar"
      ]
    }
  },

  {
    nombre: "CALAMINA",
    categoria: "Dermatología",
    sinonimos: ["calamina", "calamina locion", "calamina lotion"],
    isoColor: ISO.neutral,
    icono: "🧴",
    vias: ["top"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Prurito / picaduras / varicela",
        via: "top",
        dosis_fija_mg: 0,
        intervalo_h: 8,
        duracion: "Mientras persista el prurito",
        nota: "Loción de calamina al 8-15% (combinada habitualmente con óxido de zinc). Aplicar con torunda o algodón sobre la zona afecta tantas veces como sea necesario (habitualmente 3-4 veces al día). Sin restricción de edad: utilizable desde lactantes. Acción astringente, secante y antipruriginosa leve. Particularmente útil en lesiones de varicela (alivio del prurito sin enmascarar el aspecto de las lesiones), picaduras de insectos, urticaria localizada y dermatitis de contacto leve. Agitar el frasco antes de cada uso. No usar sobre piel exudativa importante (puede formar costra).",
        preparados: [
          { nombre: "Calamina loción (varios fabricantes, fórmula magistral o registrada)", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Prurito de la varicela (uso clásico)",
        "Picaduras de insectos y urticaria localizada",
        "Dermatitis de contacto leve",
        "Quemaduras solares leves",
        "Eccema agudo no exudativo"
      ],
      contraindicaciones: [
        "Hipersensibilidad a la calamina o componentes"
      ],
      precauciones: [
        "Sin riesgo sistémico — perfil de seguridad excelente",
        "Evitar contacto con ojos y mucosas",
        "No aplicar sobre heridas abiertas, lesiones exudativas o supurativas",
        "Su efecto es sintomático: no acelera la curación de la varicela",
        "Si hay sobreinfección bacteriana: añadir antibiótico tópico (mupirocina/ácido fusídico)"
      ]
    }
  },

  {
    nombre: "CAPTOPRIL",
    categoria: "Cardiología",
    sinonimos: ["captopril", "capoten"],
    isoColor: ISO.cardio,
    icono: "💊",
    vias: ["oral", "sl"],
    modos: ["intermitente"],
    fuente: "Pediamécum",
    intermitente: [
      {
        indicacion: "HTA / Insuficiencia cardíaca",
        via: "oral",
        dosis_mg_kg: 0.3,
        intervalo_h: 8,
        dosis_max_mg: 50,
        dosis_max_dia_mg: 150,
        nota: "Lactantes: 0,15-0,3 mg/kg/dosis iniciar, titular hasta 6 mg/kg/día. Niños: 0,3-0,5 mg/kg/dosis (máx. 6 mg/kg/día). Dosis test inicial con monitorización TA (riesgo de hipotensión 1.ª dosis). Administrar 1 h antes o 2 h después de comidas.",
        preparados: [
          { nombre: "Captopril comp. 12,5 / 25 / 50 mg", conc_mg_ml: null },
          { nombre: "Captopril fórmula magistral 1 mg/ml", conc_mg_ml: 1 }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Hipertensión arterial pediátrica",
        "Insuficiencia cardíaca congestiva (reducción de postcarga)",
        "Cardiopatías congénitas con sobrecarga ventricular izquierda",
        "Nefropatía con proteinuria significativa"
      ],
      contraindicaciones: [
        "Estenosis bilateral de arteria renal o riñón único con estenosis",
        "Hipersensibilidad a IECA",
        "Antecedente de angioedema con IECA",
        "Insuficiencia renal aguda"
      ],
      precauciones: [
        "Hipotensión de primera dosis: iniciar con dosis baja y monitorizar TA",
        "Tos seca persistente (puede requerir cambio a ARA-II)",
        "Hiperpotasemia (vigilar K+, evitar suplementos)",
        "Empeoramiento de la función renal en estenosis arterial renal"
      ]
    }
  },

  {
    nombre: "CARBÓN ACTIVADO",
    categoria: "Reanimación / UCIP",
    sinonimos: ["carbon activado", "carboactiv"],
    isoColor: ISO.rea,
    icono: "⚠️",
    vias: ["oral"],
    modos: ["puntual"],
    fuente: "SEUP",
    puntual: {
      descripcion: "Intoxicación aguda — descontaminación digestiva",
      dosis_mg_kg: 1000,
      dosis_max_mg: 50000,
      via: "Oral o por SNG, en suspensión acuosa (diluir en agua: 1 g en 5-10 ml)",
      nota: "Dosis 1 g/kg (máx. 50 g). Eficacia máxima si se administra en la primera hora tras la ingesta. Indicado en ingestas potencialmente tóxicas. Multidosis (0,5 g/kg c/4-6 h) en intoxicaciones por fármacos con recirculación enterohepática (carbamazepina, fenobarbital, dapsona, quinina, teofilina). Vía aérea protegida obligatoria si bajo nivel de conciencia."
    },
    info: {
      indicaciones: [
        "Intoxicación aguda por vía oral con sustancia adsorbible (< 1 h desde la ingesta idealmente)",
        "Pauta multidosis en intoxicaciones por fármacos con recirculación enterohepática"
      ],
      contraindicaciones: [
        "Vía aérea no protegida en paciente con disminución del nivel de conciencia",
        "Ingesta de cáusticos, hidrocarburos volátiles, hierro, litio, alcoholes (no adsorbe)",
        "Obstrucción o perforación intestinal",
        "Hemorragia digestiva"
      ],
      precauciones: [
        "Aspiración pulmonar — riesgo grave: valorar intubación previa si Glasgow ≤ 8",
        "No usar en ingesta de cáusticos (dificulta endoscopia)",
        "Estreñimiento o íleo con dosis altas o multidosis",
        "Tinción negra de heces (esperada)"
      ]
    }
  },

  {
    nombre: "CEFOTAXIMA",
    categoria: "Antibiótico",
    sinonimos: ["claforan", "cefotaxima"],
    isoColor: ISO.antibiotico,
    icono: "💉",
    vias: ["iv", "im"],
    modos: ["intermitente"],
    fuente: "Pediamécum / SEUP",
    intermitente: [
      {
        indicacion: "Sepsis / Neumonía complicada",
        via: "iv",
        dosis_mg_kg: 50,
        intervalo_h: 6,
        dosis_max_mg: 2000,
        dosis_max_dia_mg: 12000,
        nota: "Diluir y administrar en 20-30 min. En neonatos: dosis y frecuencia varían según EG y edad postnatal — consultar Neofax."
      },
      {
        indicacion: "Meningitis bacteriana",
        via: "iv",
        dosis_mg_kg: 75,
        intervalo_h: 6,
        dosis_max_mg: 3000,
        dosis_max_dia_mg: 12000,
        nota: "Dosis meningítica: 200-300 mg/kg/día. Asociar vancomicina hasta antibiograma. Considerar dexametasona si Hib o neumococo."
      }
    ],
    info: {
      indicaciones: [
        "Sepsis del lactante y neonato (con ampicilina/gentamicina según contexto)",
        "Meningitis bacteriana",
        "Neumonía complicada con derrame",
        "Pielonefritis grave",
        "Infecciones invasivas por gramnegativos"
      ],
      contraindicaciones: [
        "Alergia a betalactámicos tipo I"
      ],
      precauciones: [
        "Reactividad cruzada con penicilinas (3-7%)",
        "Eosinofilia, exantema",
        "No mezclar con soluciones que contengan calcio (precipitación) sobre todo en neonatos"
      ]
    }
  },

  {
    nombre: "CEFTRIAXONA",
    categoria: "Antibiótico",
    sinonimos: ["rocefalin", "ceftriaxona"],
    isoColor: ISO.antibiotico,
    icono: "💉",
    vias: ["iv", "im"],
    modos: ["intermitente"],
    fuente: "Pediamécum / SEUP",
    intermitente: [
      {
        indicacion: "Infección moderada-grave",
        via: "iv",
        dosis_mg_kg: 50,
        intervalo_h: 24,
        dosis_max_mg: 2000,
        nota: "Pielonefritis, neumonía grave, sepsis. Administrar en 30 min IV o IM con lidocaína al 1% sin epinefrina."
      },
      {
        indicacion: "Meningitis bacteriana",
        via: "iv",
        dosis_mg_kg: 50,
        intervalo_h: 12,
        dosis_max_mg: 2000,
        nota: "100 mg/kg/día (dividido c/12-24 h). Primera dosis 80-100 mg/kg. Considerar dexametasona previa."
      }
    ],
    info: {
      indicaciones: [
        "Sepsis y meningitis bacteriana (> 1 mes)",
        "Pielonefritis aguda",
        "Neumonía grave hospitalizada",
        "Infección gonocócica",
        "Profilaxis postexposición meningitis meningocócica (dosis única IM)"
      ],
      contraindicaciones: [
        "Neonatos < 28 días con hiperbilirrubinemia (desplaza bilirrubina)",
        "Uso concomitante con soluciones que contienen calcio en neonatos",
        "Alergia tipo I a betalactámicos"
      ],
      precauciones: [
        "Precipitación con calcio: evitar Ringer lactato en misma vía",
        "Hiperbilirrubinemia neonatal: no usar < 28 días",
        "Litiasis biliar (lodo biliar) con uso prolongado",
        "Reactividad cruzada con penicilinas"
      ]
    }
  },

  {
    nombre: "CEFUROXIMA AXETILO",
    categoria: "Antibiótico",
    sinonimos: ["zinnat", "cefuroxima"],
    isoColor: ISO.antibiotico,
    icono: "💊",
    vias: ["oral"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "OMA / faringoamigdalitis / pielonefritis no grave",
        via: "oral",
        dosis_mg_kg_dia: 30,
        intervalo_h: 12,
        dosis_max_dia_mg: 1000,
        duracion: "5-10 días según indicación",
        nota: "Alternativa en alergia no anafiláctica a amoxicilina. En pielonefritis: 20-30 mg/kg/día. Tomar con alimentos.",
        preparados: [
          { nombre: "Cefuroxima axetilo susp. 250 mg/5 ml", conc_mg_ml: 50 },
          { nombre: "Cefuroxima axetilo susp. 125 mg/5 ml", conc_mg_ml: 25 }
        ]
      }
    ],
    info: {
      indicaciones: [
        "OMA, sinusitis (alternativa a amoxi-clavulánico)",
        "Faringoamigdalitis estreptocócica",
        "Infecciones urinarias bajas",
        "Pielonefritis no complicada (vía oral si tolerancia)"
      ],
      contraindicaciones: [
        "Alergia a cefalosporinas",
        "Antecedente de anafilaxia a betalactámicos"
      ],
      precauciones: [
        "Sabor amargo: tomar con alimentos o yogur",
        "Diarrea / alteración del gusto frecuentes",
        "Reactividad cruzada con penicilinas (baja)"
      ]
    }
  },

  {
    nombre: "CETIRIZINA",
    categoria: "Antihistamínico",
    sinonimos: ["zyrtec", "cetirizina", "alercina"],
    isoColor: ISO.respiratorio,
    icono: "🤧",
    vias: ["oral"],
    modos: ["intermitente"],
    fuente: "Pediamécum",
    intermitente: [
      {
        indicacion: "Rinitis alérgica / urticaria — pauta por edad",
        via: "oral",
        dosis_fija_mg: 5,
        intervalo_h: 24,
        nota: "6 m-2 años: 2,5 mg (0,5 ml de jarabe 5 mg/5 ml) c/24 h. 2-6 años: 2,5 mg c/12 h o 5 mg c/24 h. 6-12 años: 5 mg c/12 h o 10 mg c/24 h. > 12 años: 10 mg c/24 h. Menos sedante que los antihistamínicos clásicos.",
        preparados: [
          { nombre: "Cetirizina solución oral 5 mg/5 ml (1 mg/ml)", conc_mg_ml: 1 },
          { nombre: "Cetirizina comprimidos 10 mg", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Rinitis alérgica estacional o perenne",
        "Urticaria aguda y crónica",
        "Conjuntivitis alérgica como coadyuvante"
      ],
      contraindicaciones: [
        "Hipersensibilidad a cetirizina o hidroxicina",
        "Insuficiencia renal grave (ajustar dosis)"
      ],
      precauciones: [
        "Sedación leve (menor que antihistamínicos de 1.ª generación)",
        "Sequedad de boca",
        "Ajuste de dosis en insuficiencia renal"
      ]
    }
  },

  {
    nombre: "CLORHEXIDINA",
    categoria: "Dermatología",
    sinonimos: ["clorhexidina", "cristalmina", "hibitane", "hibiscrub"],
    isoColor: ISO.antibiotico,
    icono: "🧴",
    vias: ["top"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP) / AEMPS",
    intermitente: [
      {
        indicacion: "Antisepsia de la piel / heridas / cuidado del cordón umbilical",
        via: "top",
        dosis_fija_mg: 0,
        intervalo_h: 8,
        duracion: "Según indicación (cordón: hasta caída)",
        nota: "Antiséptico de amplio espectro frente a bacterias Gram + y Gram - (eficacia menor frente a algunos Gram -), virus envueltos y hongos. **Soluciones acuosas (0,05-0,2%)**: heridas pediátricas, lavado de heridas, mucosas. **Solución 1-2% acuosa o coloreada (Cristalmina)**: antisepsia rutinaria de heridas y zonas de inserción de catéter. **Solución alcohólica (0,5-2%)**: antisepsia pre-procedimientos, piel intacta. **Cuidado del cordón umbilical**: clorhexidina acuosa 1-4% una vez al día hasta caída (reduce mortalidad neonatal en países en desarrollo; en países desarrollados con cuidado estándar la evidencia es menos clara y muchas guías prefieren cuidado seco). **Evitar solución alcohólica en neonatos < 2 meses y prematuros** (riesgo de quemadura química y absorción).",
        preparados: [
          { nombre: "Cristalmina solución 1% (acuosa coloreada)", conc_mg_ml: null },
          { nombre: "Clorhexidina acuosa 0,05% / 0,2% (lavado de heridas)", conc_mg_ml: null },
          { nombre: "Clorhexidina alcohólica 0,5-2% (antisepsia piel intacta)", conc_mg_ml: null },
          { nombre: "Hibiscrub solución jabonosa 4% (lavado quirúrgico)", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Antisepsia rutinaria de heridas leves",
        "Antisepsia pre-procedimientos (punciones, inserción de catéter)",
        "Cuidado del cordón umbilical (formulación acuosa)",
        "Higiene de manos sanitarias (Hibiscrub)",
        "Antiséptico oral en gel/colutorio (formulaciones específicas)"
      ],
      contraindicaciones: [
        "Hipersensibilidad a la clorhexidina (puede causar anafilaxia)",
        "Solución alcohólica: prematuros y neonatos < 2 meses (preferir acuosa)",
        "No aplicar en oído medio (riesgo de ototoxicidad)",
        "No combinar con jabones aniónicos (inactiva el principio activo)"
      ],
      precauciones: [
        "Dermatitis de contacto poco frecuente; reacciones anafilácticas descritas (mucho más raras)",
        "Tinción reversible de los dientes y la piel con uso oral prolongado",
        "En neonatos pretérmino la solución alcohólica puede producir quemaduras químicas — usar acuosa",
        "Evitar contacto con ojos, oído medio y meninges expuestas",
        "Esperar a que seque antes de cubrir la zona (riesgo de irritación si se cubre húmeda)"
      ]
    }
  },

  {
    nombre: "CLORURO CÁLCICO / GLUCONATO CÁLCICO",
    categoria: "Reanimación / UCIP",
    sinonimos: ["cloruro calcico", "gluconato calcico", "calcio"],
    isoColor: ISO.rea,
    icono: "⚡",
    vias: ["iv", "io"],
    modos: ["puntual"],
    fuente: "SEUP / Pediamécum",
    puntual: {
      descripcion: "Hipocalcemia sintomática / Hiperpotasemia con cambios ECG / Toxicidad por Ca-antagonistas / Hipermagnesemia",
      dosis_mg_kg: 100,
      dosis_max_mg: 2000,
      via: "IV/IO lenta (en 5-10 min, vía central preferente para cloruro). Diluir 1:1 con SSF si vía periférica.",
      nota: "DOS PREPARACIONES con dosis diferentes: ⚠️ NO confundir. Gluconato cálcico 10%: 0,5-1 ml/kg (50-100 mg/kg de la sal; equivale a 4,6-9,2 mg/kg de calcio elemental). Cloruro cálcico 10%: 0,2 ml/kg (20 mg/kg de la sal; aporta 3x más calcio elemental que el gluconato — preferido en PCR/colapso). Máx. 20 ml gluconato o 10 ml cloruro por dosis. Vigilar bradicardia/asistolia durante infusión. Vía central preferente para cloruro (irritante)."
    },
    info: {
      indicaciones: [
        "Hipocalcemia sintomática (tetania, convulsiones, prolongación QT)",
        "Hiperpotasemia con cambios ECG (estabilización de membrana)",
        "Intoxicación por calcio-antagonistas",
        "Hipermagnesemia sintomática (antídoto)",
        "PCR con hipocalcemia confirmada (no rutinario)"
      ],
      contraindicaciones: [
        "Hipercalcemia",
        "Toxicidad digitálica (potencia)",
        "Fibrilación ventricular (no usar como rutina)"
      ],
      precauciones: [
        "Extravasación: necrosis tisular grave — preferir vía central (sobre todo cloruro)",
        "Bradicardia y asistolia con infusión rápida — administrar lento y monitorizar ECG",
        "Precipitación con bicarbonato, fosfato y ceftriaxona en neonatos (no compartir vía)",
        "Cloruro cálcico es 3x más potente que gluconato a igual volumen — diferenciar claramente al prescribir"
      ]
    }
  },

  {
    nombre: "CLORURO POTÁSICO",
    categoria: "Reanimación / UCIP",
    sinonimos: ["cloruro potasico", "potasio", "clk", "kcl", "ap inyectable"],
    isoColor: ISO.rea,
    icono: "⚡",
    vias: ["iv", "oral"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP) / UCIP",
    intermitente: [
      {
        indicacion: "Hipopotasemia — corrección IV",
        via: "iv",
        dosis_mg_kg: 37,
        intervalo_h: 6,
        nota: "Dosis: 0,5-1 mEq/kg/dosis (1 mEq KCl = 74,5 mg) en perfusión. ⚠️ NUNCA administrar en bolo IV directo (riesgo de parada cardíaca). Velocidad máxima: 0,25-0,5 mEq/kg/h (excepcionalmente hasta 1 mEq/kg/h con monitorización ECG continua en UCIP). Concentración máxima: 40 mEq/L por vía periférica; hasta 80 mEq/L por vía central. Diluir siempre en SSF o SG5%. Monitorizar K+ sérico y ECG."
      },
      {
        indicacion: "Mantenimiento / Hipopotasemia leve (oral)",
        via: "oral",
        dosis_mg_kg_dia: 150,
        intervalo_h: 8,
        nota: "1-4 mEq/kg/día divididos en 2-4 tomas. Vía oral preferente en hipopotasemia leve-moderada sin cambios ECG. Tomar con alimentos para reducir irritación gástrica.",
        preparados: [
          { nombre: "Boi-K / Boi-K aspártico comprimidos efervescentes (10-25 mEq)", conc_mg_ml: null },
          { nombre: "Potasion solución / cápsulas", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Hipopotasemia (pérdidas digestivas, diuréticos, alcalosis, cetoacidosis tratada)",
        "Prevención de hipopotasemia en fluidoterapia de mantenimiento",
        "Reposición en poliuria o pérdidas renales"
      ],
      contraindicaciones: [
        "Hiperpotasemia",
        "Insuficiencia renal con oligoanuria",
        "Enfermedad de Addison no tratada",
        "Administración IV en bolo (riesgo letal)"
      ],
      precauciones: [
        "⚠️ NUNCA en bolo IV — parada cardíaca. Siempre diluido y en perfusión lenta",
        "Monitorización ECG y K+ sérico en correcciones IV",
        "Vía central si concentración > 40 mEq/L",
        "Irritación venosa y dolor en vía periférica con concentraciones altas",
        "Precaución con ahorradores de potasio, IECA, ARA-II (riesgo de hiperpotasemia)"
      ]
    }
  },

  {
    nombre: "CLOTRIMAZOL TÓPICO",
    categoria: "Dermatología",
    sinonimos: ["canesten", "clotrimazol", "gine-canesten"],
    isoColor: ISO.antibiotico,
    icono: "🧴",
    vias: ["top"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Candidiasis cutánea / Dermatomicosis",
        via: "top",
        dosis_fija_mg: 0,
        intervalo_h: 8,
        duracion: "2-4 semanas (continuar 1-2 sem tras resolución)",
        nota: "Crema, solución o polvo al 1% (10 mg/g). Aplicar capa fina sobre la lesión y zona perilesional 2-3 veces al día. Mantener el tratamiento durante 1-2 semanas tras desaparición de los síntomas para evitar recidivas. Sin restricción de edad: utilizable en lactantes y neonatos. Es el antifúngico tópico de elección en dermatitis del pañal candidiásica (alternativa: nistatina o miconazol). Cubre Candida spp., dermatofitos (Trichophyton, Microsporum, Epidermophyton) y Malassezia.",
        preparados: [
          { nombre: "Canesten crema 1% (10 mg/g)", conc_mg_ml: null },
          { nombre: "Canesten solución 1%", conc_mg_ml: null },
          { nombre: "Canesten polvo 1%", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Candidiasis cutánea (dermatitis del pañal candidiásica)",
        "Tinea corporis, cruris, pedis, manuum",
        "Pitiriasis versicolor",
        "Intertrigo, eritrasma",
        "Otomicosis (uso ORL)"
      ],
      contraindicaciones: [
        "Hipersensibilidad al fármaco"
      ],
      precauciones: [
        "Irritación local leve, prurito o ardor transitorio",
        "Evitar contacto con ojos y mucosas (salvo formulaciones específicas)",
        "Si no mejora en 2-4 semanas: reevaluar diagnóstico",
        "En infección extensa o resistente: valorar antifúngico sistémico",
        "Mantener bien seca la zona tratada"
      ]
    }
  },

  {
    nombre: "CLOXACILINA",
    categoria: "Antibiótico",
    sinonimos: ["orbenin", "cloxacilina"],
    isoColor: ISO.antibiotico,
    icono: "💉",
    vias: ["iv", "oral"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Infecciones por S. aureus (IV)",
        via: "iv",
        dosis_mg_kg: 50,
        intervalo_h: 6,
        dosis_max_mg: 2000,
        dosis_max_dia_mg: 12000,
        nota: "Indicada en celulitis grave, artritis séptica, osteomielitis, bacteriemia por S. aureus meticilín-sensible. Administrar en 30-60 min."
      },
      {
        indicacion: "Infección moderada (oral)",
        via: "oral",
        dosis_mg_kg_dia: 50,
        intervalo_h: 6,
        dosis_max_dia_mg: 4000,
        duracion: "7-14 días",
        nota: "Tomar con el estómago vacío. Baja biodisponibilidad oral: preferir IV si infección significativa.",
        preparados: [
          { nombre: "Cloxacilina susp. 125 mg/5 ml", conc_mg_ml: 25 }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Infecciones por S. aureus meticilín-sensible",
        "Celulitis, artritis séptica, osteomielitis",
        "Endocarditis estafilocócica"
      ],
      contraindicaciones: [
        "Alergia a betalactámicos"
      ],
      precauciones: [
        "Vía periférica: irritante, riesgo de flebitis",
        "Mala absorción oral, especialmente con alimentos",
        "Hepatotoxicidad ocasional con dosis altas prolongadas"
      ]
    }
  },

  {
    nombre: "CICLOPENTOLATO",
    categoria: "Oftalmología",
    sinonimos: ["colircusi ciclopléjico", "ciclopléjico", "ciclopentolato"],
    isoColor: ISO.respiratorio,
    icono: "👁️",
    vias: ["oft"],
    modos: ["puntual"],
    fuente: "Pediamécum (AEP)",
    puntual: {
      descripcion: "Cicloplejia para refracción / Midriasis diagnóstica",
      dosis_fija_mg: 0,
      via: "Colirio oftálmico — instilar 1 gota en el saco conjuntival",
      nota: "Anticolinérgico midriático y ciclopléjico de acción media (8-24 h). **Concentraciones**: Colircusi Ciclopléjico 1% (estándar > 1 año) y 0,5% (recomendable < 1 año por menor absorción sistémica). **Pauta para refracción**: 1 gota en cada ojo y repetir a los 5-15 min (1-2 instilaciones según pigmentación iridiana). Comprimir saco lagrimal 1-2 min tras cada gota para reducir absorción sistémica. Máxima cicloplejia a los 30-45 min. **Edad mínima**: lactantes ≥ 1 mes con la presentación al 0,5% bajo control oftalmológico; en general ≥ 6 meses. **Vigilar a lactantes durante 30 min tras la instilación**: riesgo de toxicidad sistémica anticolinérgica (sequedad de mucosas, taquicardia, agitación, fiebre, alucinaciones, hasta convulsiones)."
    },
    info: {
      indicaciones: [
        "Cicloplejia para refracción objetiva en niños (uso estándar en oftalmología pediátrica)",
        "Midriasis diagnóstica para examen del fondo de ojo (alternativa a tropicamida si se busca cicloplejia)",
        "Uveítis anterior (cicloplejia terapéutica)"
      ],
      contraindicaciones: [
        "Hipersensibilidad a anticolinérgicos",
        "Glaucoma de ángulo cerrado conocido o sospechado",
        "Lactantes < 1 mes con la formulación al 1% (preferir 0,5%)"
      ],
      precauciones: [
        "Toxicidad sistémica anticolinérgica en lactantes y niños pequeños (vigilar 30 min)",
        "Comprimir saco lagrimal tras la instilación para reducir absorción",
        "Fotofobia y visión borrosa hasta 24 h tras la administración (advertir a la familia)",
        "Evitar conducir o realizar tareas de precisión durante 24 h en adolescentes",
        "Sequedad de mucosas, taquicardia, agitación: signos de toxicidad — suspender"
      ]
    }
  },

  {
    nombre: "CIPROFLOXACINO ÓTICO",
    categoria: "Otorrinolaringología",
    sinonimos: ["cetraxal", "otex", "ciprofloxacino otico", "synalar otico"],
    isoColor: ISO.antibiotico,
    icono: "👂",
    vias: ["top"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Otitis externa difusa / Otitis media supurada con perforación timpánica",
        via: "top",
        dosis_fija_mg: 0,
        intervalo_h: 12,
        duracion: "7-10 días (otitis externa); 7 días (otorrea por DTT u OMA perforada)",
        nota: "Gotas óticas 2 mg/ml (0,2%) o 3 mg/ml (0,3%) en monodosis. **Posología**: 4 gotas en cada oído afecto cada 8-12 h, o una monodosis (0,25 ml) c/12 h × 7-10 días. Calentar el envase entre las manos antes de instilar para evitar vértigo. Inclinar la cabeza con el oído afecto hacia arriba, tirar del pabellón auricular hacia atrás y arriba, presionar el trago para favorecer entrada al conducto. Mantener la posición 1 min. **Edad mínima**: ≥ 1 año (uso pediátrico bien establecido en ≥ 6 meses por algunos protocolos). Es **seguro con perforación timpánica** (no ototóxico).",
        preparados: [
          { nombre: "Cetraxal monodosis 2 mg/ml (0,25 ml)", conc_mg_ml: 2 },
          { nombre: "Otex Hydrocortisona gotas (también con corticoide)", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Otitis externa difusa bacteriana",
        "Otitis media aguda perforada con otorrea (alternativa al sistémico en formas leves)",
        "Otorrea por drenajes timpánicos (DTT)",
        "Otitis externa maligna (uso especializado)"
      ],
      contraindicaciones: [
        "Hipersensibilidad a quinolonas",
        "Otomicosis (puede empeorar)",
        "Otitis vírica simple"
      ],
      precauciones: [
        "Picor, irritación local leve",
        "Sobreinfección por hongos con uso prolongado",
        "Sin ototoxicidad: seguro con perforación timpánica (a diferencia de aminoglucósidos óticos)",
        "Si no mejora en 48-72 h: reevaluar diagnóstico (otomicosis, foliculitis del CAE)"
      ]
    }
  },

  {
    nombre: "CIPROFLOXACINO + FLUOCINOLONA ÓTICO",
    categoria: "Otorrinolaringología",
    sinonimos: ["cetraxal plus", "cetraxal otico plus", "ciprofloxacino fluocinolona"],
    isoColor: ISO.antibiotico,
    icono: "👂",
    vias: ["top"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Otitis externa aguda con inflamación marcada / Otorrea por DTT inflamada",
        via: "top",
        dosis_fija_mg: 0,
        intervalo_h: 12,
        duracion: "7 días",
        nota: "Combinación de ciprofloxacino 3 mg/ml + fluocinolona acetónido 0,25 mg/ml en gotas óticas. **Posología**: 6 gotas en cada oído afecto cada 12 h durante 7 días. **Edad mínima**: ≥ 6 meses. La asociación con corticoide acelera el alivio del dolor y la inflamación en otitis externa con edema importante del CAE. Calentar el envase entre las manos antes de instilar. Reposo con la cabeza inclinada 1 min tras la aplicación. Seguro con perforación timpánica.",
        preparados: [
          { nombre: "Cetraxal Plus gotas óticas (ciprofloxacino 3 mg/ml + fluocinolona 0,25 mg/ml)", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Otitis externa aguda con edema, dolor o inflamación importante del CAE",
        "Otorrea por DTT con inflamación marcada",
        "Otitis externa con dermatitis del CAE"
      ],
      contraindicaciones: [
        "Hipersensibilidad a quinolonas o corticoides",
        "Otomicosis",
        "Infecciones víricas del CAE (varicela, herpes zóster ótico)",
        "< 6 meses"
      ],
      precauciones: [
        "Picor, escozor local",
        "El corticoide puede enmascarar progresión de la infección — reevaluar en 48-72 h",
        "Sobreinfección por hongos con uso prolongado",
        "No prolongar más de 7 días sin evaluación",
        "Seguro con perforación timpánica"
      ]
    }
  },

  {
    nombre: "CLINDAMICINA",
    categoria: "Antibiótico",
    sinonimos: ["dalacin", "clindamicina"],
    isoColor: ISO.antibiotico,
    icono: "💉",
    vias: ["iv", "oral"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Infección de piel/partes blandas, alérgicos a betalactámicos",
        via: "oral",
        dosis_mg_kg_dia: 30,
        intervalo_h: 8,
        dosis_max_dia_mg: 1800,
        duracion: "7-10 días según indicación",
        nota: "20-40 mg/kg/día divididos en 3-4 dosis. Útil en alergia a penicilina. Cubre cocos gram + (incluido SARM comunitario) y anaerobios.",
        preparados: [
          { nombre: "Clindamicina cápsulas 150 / 300 mg", conc_mg_ml: null },
          { nombre: "Clindamicina susp. 75 mg/5 ml (15 mg/ml)", conc_mg_ml: 15 }
        ]
      },
      {
        indicacion: "Infección invasiva grave (IV)",
        via: "iv",
        dosis_mg_kg_dia: 40,
        intervalo_h: 8,
        dosis_max_dia_mg: 2700,
        nota: "Pediamécum: 25-40 mg/kg/día IV divididos cada 6-8 h, máx. 2,7 g/día. En shock tóxico estreptocócico/estafilocócico: dosis altas (40 mg/kg/día c/6 h) asociadas a betalactámico/vancomicina por efecto antitoxina. Administrar en 30-60 min para evitar reacción tipo eritrodisestésica."
      }
    ],
    info: {
      indicaciones: [
        "Infecciones por anaerobios (abscesos, neumonía aspirativa)",
        "Infecciones de piel y partes blandas (SARM comunitario)",
        "Infecciones óseas y articulares",
        "Síndrome de shock tóxico (efecto antitoxina)",
        "Alternativa en alérgicos a betalactámicos"
      ],
      contraindicaciones: [
        "Hipersensibilidad a lincosamidas",
        "Antecedente de colitis pseudomembranosa"
      ],
      precauciones: [
        "Colitis por C. difficile — riesgo significativo",
        "Sabor amargo de la suspensión: dificulta administración pediátrica",
        "Bloqueo neuromuscular (raro)",
        "Hepatotoxicidad ocasional"
      ]
    }
  },

  {
    nombre: "COTRIMOXAZOL (TRIMETOPRIM-SULFAMETOXAZOL)",
    categoria: "Antibiótico",
    sinonimos: ["septrin", "septrim", "cotrimoxazol", "trimetoprim-sulfametoxazol", "bactrim"],
    isoColor: ISO.antibiotico,
    icono: "💊",
    vias: ["oral", "iv"],
    modos: ["intermitente"],
    fuente: "Pediamécum / SEUP",
    intermitente: [
      {
        indicacion: "ITU / Infección respiratoria",
        via: "oral",
        dosis_mg_kg: 4,
        intervalo_h: 12,
        dosis_max_mg: 160,
        duracion: "7-10 días",
        nota: "Dosis expresada en trimetoprim (TMP). 8-12 mg TMP/kg/día divididos cada 12 h. Profilaxis ITU: 2 mg TMP/kg en dosis nocturna única. Profilaxis PJP: 5 mg TMP/kg/día divididos en 2 dosis 3 días/semana.",
        preparados: [
          { nombre: "Septrin pediátrico susp. (40 mg TMP + 200 mg SMX)/5 ml", conc_mg_ml: 8 },
          { nombre: "Septrin comprimidos (80+400 mg / 160+800 mg)", conc_mg_ml: null }
        ]
      },
      {
        indicacion: "Neumonía por P. jiroveci (tratamiento)",
        via: "iv",
        dosis_mg_kg: 5,
        intervalo_h: 6,
        nota: "Dosis altas: 15-20 mg TMP/kg/día divididos cada 6-8 h durante 21 días. Asociar corticoides si PaO2 < 70 mmHg. Vigilar nefrotoxicidad y mielotoxicidad."
      }
    ],
    info: {
      indicaciones: [
        "Infección urinaria no complicada y profilaxis",
        "Neumonía por Pneumocystis jiroveci (tratamiento y profilaxis)",
        "Toxoplasmosis (alternativa)",
        "Infecciones por Stenotrophomonas, Burkholderia"
      ],
      contraindicaciones: [
        "< 2 meses (riesgo de kernicterus)",
        "Déficit de G6PD",
        "Alergia a sulfamidas",
        "Insuficiencia hepática o renal grave"
      ],
      precauciones: [
        "Exantema: vigilar progresión a SJS / NET",
        "Mielosupresión: vigilar hemograma en uso prolongado",
        "Hiperpotasemia, hipoglucemia",
        "Mantener buena hidratación (cristaluria)"
      ]
    }
  },

  // ── D ─────────────────────────────────────────────────────
  {
    nombre: "DEFLAZACORT",
    categoria: "Corticoide",
    sinonimos: ["zamene", "deflazacort", "dezacor"],
    isoColor: ISO.respiratorio,
    icono: "💊",
    vias: ["oral"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Corticoterapia oral (asma, brotes inflamatorios, autoinmunes)",
        via: "oral",
        dosis_mg_kg: 1,
        intervalo_h: 24,
        dosis_max_mg: 90,
        duracion: "Según indicación (pauta corta sin descenso si < 7 días)",
        nota: "Corticoide oral de uso frecuente en España. **Equivalencia**: 6 mg de deflazacort ≈ 5 mg de prednisona/prednisolona. Dosis habitual 0,25-1,5 mg/kg/día en 1 toma matutina. Distrofia muscular de Duchenne: 0,9 mg/kg/día (indicación específica). Presentaciones en gotas (Zamene 22,75 mg/ml) y comprimidos.",
        preparados: [
          { nombre: "Zamene gotas 22,75 mg/ml (1 gota ≈ 1 mg)", conc_mg_ml: 22.75 },
          { nombre: "Zamene comprimidos 6 / 30 mg", conc_mg_ml: null },
          { nombre: "Dezacor gotas / comprimidos", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Asma agudo moderado-grave (alternativa a prednisolona)",
        "Brotes de enfermedades autoinmunes e inflamatorias",
        "Síndrome nefrótico (dosis altas)",
        "Distrofia muscular de Duchenne (indicación específica)",
        "Reacciones alérgicas, urticaria"
      ],
      contraindicaciones: [
        "Infección sistémica no controlada",
        "Varicela activa (uso sistémico)",
        "Hipersensibilidad"
      ],
      precauciones: [
        "Hiperglucemia, HTA, retención hidrosalina",
        "No suspender bruscamente tras > 7-10 días",
        "Inmunosupresión con dosis altas o prolongadas",
        "Vigilar crecimiento en uso prolongado"
      ]
    }
  },

  {
    nombre: "DESLORATADINA",
    categoria: "Antihistamínico",
    sinonimos: ["aerius", "azomyr", "desloratadina"],
    isoColor: ISO.respiratorio,
    icono: "🤧",
    vias: ["oral"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Rinitis alérgica / urticaria — pauta por edad",
        via: "oral",
        dosis_fija_mg: 2.5,
        intervalo_h: 24,
        nota: "Antihistamínico H1 de 2.ª generación, no sedante. Pauta por edad: 6-11 meses → 1 mg/día (2 ml solución); 1-5 años → 1,25 mg/día (2,5 ml); 6-11 años → 2,5 mg/día (5 ml); ≥ 12 años → 5 mg/día. Una sola toma al día. Inicio efecto en 30 min, duración 24 h. No es sedante de forma significativa.",
        preparados: [
          { nombre: "Aerius solución oral 0,5 mg/ml (2,5 mg/5 ml)", conc_mg_ml: 0.5 },
          { nombre: "Aerius comp. recubiertos 5 mg", conc_mg_ml: null },
          { nombre: "Aerius comp. bucodispersables 2,5 / 5 mg", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Rinitis alérgica estacional y perenne",
        "Urticaria crónica idiopática",
        "Coadyuvante en conjuntivitis alérgica"
      ],
      contraindicaciones: [
        "Hipersensibilidad al fármaco o a loratadina",
        "Insuficiencia renal grave (ajustar dosis)"
      ],
      precauciones: [
        "Sedación poco frecuente comparado con antihistamínicos de 1.ª generación",
        "Cefalea, sequedad de boca, fatiga (efectos leves)",
        "Ajuste de dosis en insuficiencia renal grave",
        "Sin efecto significativo sobre QT"
      ]
    }
  },

  {
    nombre: "DEXAMETASONA",
    categoria: "Corticoide",
    sinonimos: ["fortecortin", "dexametasona"],
    isoColor: ISO.respiratorio,
    icono: "💊",
    vias: ["oral", "iv", "im"],
    modos: ["intermitente"],
    fuente: "SEUP / Pediamécum",
    intermitente: [
      {
        indicacion: "Crup (laringitis aguda)",
        via: "oral",
        dosis_mg_kg: 0.15,
        intervalo_h: 24,
        dosis_max_mg: 10,
        duracion: "Dosis única (repetir en 24 h si persiste)",
        nota: "Dosis equivalente IV/IM si vómitos. Algunas guías indican 0,6 mg/kg en formas graves (máx. 10 mg). Inicio del efecto en 30 min, efecto máximo 6 h.",
        preparados: [
          { nombre: "Dexametasona ampolla 4 mg/ml (uso oral)", conc_mg_ml: 4 },
          { nombre: "Dexametasona ampolla 40 mg/5 ml", conc_mg_ml: 8 }
        ]
      },
      {
        indicacion: "Meningitis bacteriana (coadyuvante)",
        via: "iv",
        dosis_mg_kg: 0.15,
        intervalo_h: 6,
        dosis_max_mg: 10,
        duracion: "4 días",
        nota: "Administrar 10-20 min ANTES o con la primera dosis de antibiótico. Beneficio claro en meningitis por H. influenzae, probable en neumococo."
      },
      {
        indicacion: "Antiemético postoperatorio / quimioterapia",
        via: "iv",
        dosis_mg_kg: 0.15,
        intervalo_h: 24,
        dosis_max_mg: 8,
        nota: "Dosis única en cirugía. Como antiemético en quimio: 8-10 mg/m²."
      }
    ],
    info: {
      indicaciones: [
        "Crup moderado-grave (primera línea)",
        "Asma agudo grave (alternativa a prednisolona)",
        "Edema cerebral, masa tumoral cerebral",
        "Coadyuvante en meningitis bacteriana",
        "Profilaxis y tratamiento de náuseas y vómitos"
      ],
      contraindicaciones: [
        "Infección sistémica grave no controlada (excepto meningitis)",
        "Varicela activa, herpes zoster (uso sistémico)"
      ],
      precauciones: [
        "Inmunosupresión con dosis altas o prolongadas",
        "Hiperglucemia, HTA, alteración del ánimo",
        "No suspender bruscamente si tratamiento > 7 días"
      ]
    }
  },

  {
    nombre: "DEXCLORFENIRAMINA",
    categoria: "Antihistamínico",
    sinonimos: ["polaramine", "dexclorfeniramina"],
    isoColor: ISO.respiratorio,
    icono: "🤧",
    vias: ["oral", "iv", "im"],
    modos: ["intermitente"],
    fuente: "Pediamécum",
    intermitente: [
      {
        indicacion: "Reacción alérgica / urticaria aguda",
        via: "oral",
        dosis_mg_kg: 0.15,
        intervalo_h: 6,
        dosis_max_mg: 6,
        dosis_max_dia_mg: 24,
        nota: "0,15-0,2 mg/kg/dosis cada 6-8 h. > 12 años: 2-6 mg/dosis. Antihistamínico clásico, más sedante. Útil en cuadros agudos donde el efecto sedante puede ser deseable.",
        preparados: [
          { nombre: "Polaramine jarabe 2 mg/5 ml (0,4 mg/ml)", conc_mg_ml: 0.4 },
          { nombre: "Polaramine comp. 2 mg / 6 mg repetabs", conc_mg_ml: null }
        ]
      },
      {
        indicacion: "Reacción alérgica grave / anafilaxia (coadyuvante)",
        via: "iv",
        dosis_mg_kg: 0.15,
        intervalo_h: 6,
        dosis_max_mg: 5,
        nota: "0,15 mg/kg IV lenta (máx. 5 mg). Coadyuvante en anafilaxia tras adrenalina, NUNCA primera línea."
      }
    ],
    info: {
      indicaciones: [
        "Urticaria, angioedema sin compromiso vital",
        "Reacciones alérgicas leves",
        "Coadyuvante en anafilaxia (tras adrenalina)",
        "Reacciones cutáneas pruriginosas"
      ],
      contraindicaciones: [
        "Lactantes < 6 meses",
        "Glaucoma de ángulo cerrado",
        "Retención urinaria por obstrucción",
        "Crisis de asma activa"
      ],
      precauciones: [
        "Sedación importante: precaución en escolares (rendimiento)",
        "Excitación paradójica en lactantes",
        "Sequedad de boca, retención urinaria",
        "Potencia depresores SNC"
      ]
    }
  },

  {
    nombre: "DEXKETOPROFENO",
    categoria: "Analgesia / Antitérmico",
    sinonimos: ["enantyum", "dexketoprofeno", "ketesse"],
    isoColor: ISO.analgesia,
    icono: "💊",
    vias: ["oral", "iv"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP) / AEMPS",
    intermitente: [
      {
        indicacion: "Dolor agudo leve-moderado (adolescentes)",
        via: "oral",
        dosis_fija_mg: 25,
        intervalo_h: 8,
        dosis_max_dia_mg: 75,
        nota: "AINE. **No autorizado formalmente en < 18 años**, pero usado en adolescentes en algunos protocolos de dolor agudo. > 12 años / adolescentes: 12,5 mg cada 6-8 h o 25 mg cada 8 h (máx. 75 mg/día). Tomar con alimentos. Vía IV/IM (50 mg) en dolor moderado-intenso hospitalario en adolescentes. Preferir ibuprofeno o naproxeno en pediatría general (mejor evidencia).",
        preparados: [
          { nombre: "Enantyum comprimidos 12,5 / 25 mg", conc_mg_ml: null },
          { nombre: "Enantyum granulado 25 mg sobre", conc_mg_ml: null },
          { nombre: "Enantyum ampolla 50 mg/2 ml (IV/IM)", conc_mg_ml: 25 }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Dolor agudo leve-moderado en adolescentes (dental, traumático, dismenorrea)",
        "Dolor postoperatorio (IV, adolescentes)"
      ],
      contraindicaciones: [
        "< 12-18 años (uso fuera de ficha técnica; preferir ibuprofeno/naproxeno)",
        "Úlcera péptica activa, hemorragia digestiva",
        "Insuficiencia renal, hepática o cardíaca grave",
        "Asma inducido por AINE, alergia a AINE",
        "Deshidratación"
      ],
      precauciones: [
        "Toxicidad gastrointestinal (tomar con alimentos, valorar gastroprotección)",
        "Nefrotoxicidad — evitar en deshidratación o hipovolemia",
        "No combinar con otros AINE",
        "En pediatría general son preferibles ibuprofeno y naproxeno"
      ]
    }
  },

  {
    nombre: "DEXMEDETOMIDINA",
    categoria: "Analgesia / Sedación",
    sinonimos: ["dexdor", "dexmedetomidina", "precedex"],
    isoColor: ISO.neuro,
    icono: "💉",
    vias: ["iv", "neb"],
    modos: ["carga_mantenimiento", "puntual"],
    fuente: "Pediamécum / UCIP",
    carga: {
      descripcion: "Sedación en UCIP / Procedimientos",
      dosis_mcg_kg: 1,
      tiempo_min: 10,
      via: "IV en 10 min (o sin carga si ya se prevé perfusión prolongada para evitar hipotensión)",
      nota: "Carga 0,5-1 mcg/kg en 10 min. Mantenimiento: 0,2-1,4 mcg/kg/h. Sedante α2 sin depresión respiratoria significativa. Vía intranasal en procedimientos: 2-4 mcg/kg (inicio 25-30 min). Ahorra opioides y benzodiacepinas en UCIP."
    },
    puntual: {
      descripcion: "Sedación intranasal para procedimientos no dolorosos",
      dosis_mcg_kg: 3,
      dosis_max_mg: 0.2,
      via: "Intranasal (atomizador)",
      nota: "2-4 mcg/kg intranasal. Inicio del efecto en 25-30 min, duración 60-90 min. Útil para TAC, RMN, ecocardiograma. No requiere ayuno estricto. Vigilar bradicardia leve."
    },
    presentaciones: [
      {
        label: "200 mcg / 50 ml SSF (UCIP)",
        dosis_mg: 0.2, dilucion_ml: 50, suero: "SSF",
        concUgMl: (0.2 * 1000) / 50,            // 4 mcg/ml
        dosisRange: "0,2 – 1,4 mcg/kg/h",
        dosisMin: 0.2, softMax: 1.4, hardMax: 2,
        unidad: "mcg/kg/h", calcTipo: "mcg_kg_h"
      }
    ],
    info: {
      indicaciones: [
        "Sedación en UCIP (especialmente en weaning de ventilación)",
        "Sedación para procedimientos no dolorosos en niños (RMN, TAC)",
        "Sedoanalgesia coadyuvante (ahorra opioides y benzodiacepinas)",
        "Síndrome de abstinencia neonatal (uso emergente)"
      ],
      contraindicaciones: [
        "Bradiarritmias graves, bloqueo AV avanzado",
        "Hipotensión no controlada",
        "Hipovolemia significativa no corregida"
      ],
      precauciones: [
        "Bradicardia e hipotensión (especialmente con bolo de carga rápido)",
        "Síndrome de abstinencia con uso prolongado > 5 días (retirar gradualmente)",
        "Sin efecto sobre vía aérea: ventaja en sedaciones sin intubación",
        "Sequedad de boca"
      ]
    }
  },

  {
    nombre: "DIAZEPAM",
    categoria: "Antiepiléptico / Sedante",
    sinonimos: ["valium", "diazepam", "stesolid"],
    isoColor: ISO.neuro,
    icono: "🧠",
    vias: ["iv", "rectal", "oral", "im"],
    modos: ["puntual"],
    fuente: "SEUP / Pediamécum",
    puntual: {
      descripcion: "Crisis convulsiva activa",
      dosis_mg_kg: 0.3,
      dosis_max_mg: 10,
      via: "IV 0,3 mg/kg lento (1 mg/min, máx. 10 mg). Rectal (Stesolid): 0,5 mg/kg (máx. 10 mg) — 5 mg si < 3 años; 10 mg si ≥ 3 años. Repetir en 5-10 min si persiste.",
      nota: "Midazolam bucal/intranasal (0,3 mg/kg) o intramuscular se prefiere actualmente al diazepam rectal por mayor rapidez de acción y aceptación. Vigilar depresión respiratoria. No diluir con sueros (precipitación)."
    },
    info: {
      indicaciones: [
        "Crisis convulsiva aguda",
        "Estatus epiléptico (primera línea como benzodiacepina)",
        "Sedación previa a procedimientos cortos"
      ],
      contraindicaciones: [
        "Hipersensibilidad a benzodiacepinas",
        "Miastenia gravis",
        "Apnea del sueño grave",
        "Insuficiencia respiratoria grave"
      ],
      precauciones: [
        "Depresión respiratoria — disponer de material de soporte ventilatorio",
        "Acumulación con uso repetido (vida media larga)",
        "Antídoto: flumazenilo (uso muy cuidadoso si crisis activa)"
      ]
    }
  },

  {
    nombre: "DIGOXINA",
    categoria: "Cardiología",
    sinonimos: ["digoxina", "lanacordin"],
    isoColor: ISO.cardio,
    icono: "🫀",
    vias: ["oral", "iv"],
    modos: ["carga_mantenimiento"],
    fuente: "Pediamécum",
    carga: {
      descripcion: "Digitalización en insuficiencia cardíaca",
      dosis_mcg_kg: 30,
      via: "Oral preferente (IV reservar; reducir dosis IV 25-30%). Carga repartida: ½ dosis inicial, ¼ a las 6-8 h, ¼ a las 12-16 h.",
      nota: "Dosis total carga oral por edad: prematuros 20 mcg/kg, < 2 años 30-40 mcg/kg, > 2 años 30-40 mcg/kg (máx. 1-1,5 mg total). Dosis IV = 75% de la oral. Mantenimiento: 25% de la dosis total de carga al día, dividida en 2 dosis."
    },
    intermitente: [
      {
        indicacion: "Mantenimiento (oral)",
        via: "oral",
        dosis_mcg_kg: 5,
        intervalo_h: 12,
        nota: "5-10 mcg/kg/día dividido cada 12 h. Lactantes pueden necesitar dosis algo mayores. Niveles diana 0,8-2 ng/ml.",
        preparados: [
          { nombre: "Lanacordin solución pediátrica 0,05 mg/ml", conc_mg_ml: 0.05 },
          { nombre: "Lanacordin comp. 0,25 mg", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Insuficiencia cardíaca congestiva (función sistólica reducida)",
        "Control de frecuencia ventricular en FA / flutter",
        "Algunas taquicardias supraventriculares fetales/neonatales"
      ],
      contraindicaciones: [
        "Bloqueo AV 2.º-3.er grado sin marcapasos",
        "Miocardiopatía hipertrófica obstructiva",
        "Síndrome de WPW con FA",
        "TV/FV"
      ],
      precauciones: [
        "Estrecho margen terapéutico — monitorizar niveles",
        "Toxicidad agravada por hipocalemia, hipomagnesemia, hipercalcemia, hipotiroidismo",
        "Náuseas, vómitos, anorexia, alteraciones visuales (cromatopsia amarilla)",
        "Antídoto: anticuerpos antidigoxina (Digifab)"
      ]
    }
  },

  {
    nombre: "DIMETICONA 4%",
    categoria: "Dermatología",
    sinonimos: ["dimeticona", "filvit", "neositrin", "fullmarks", "paranix"],
    isoColor: ISO.neutral,
    icono: "🧴",
    vias: ["top"],
    modos: ["puntual"],
    fuente: "Pediamécum (AEP) / SEUP",
    puntual: {
      descripcion: "Pediculosis capitis — primera línea pediátrica",
      dosis_fija_mg: 0,
      via: "Aplicación tópica sobre el cuero cabelludo seco, dejar actuar y aclarar",
      nota: "Loción al 4% (algunas formulaciones 10%). Aplicar sobre cuero cabelludo y cabello **secos** hasta empapar bien, masajear suavemente. Dejar actuar 8 horas (algunas formulaciones más recientes: 15-30 min). Lavar con champú habitual y peinar con lendrera de púas finas mientras el pelo está mojado. **Repetir la aplicación a los 7-10 días** para eliminar las liendres que eclosionaron tras la primera aplicación. Sin restricción de edad: utilizable desde lactantes. Mecanismo **físico** (recubre y asfixia los piojos), por lo que **no genera resistencias**. Es la primera línea actual recomendada en pediatría desplazando a permetrina y malatión. Inflamable: no fumar ni acercar fuentes de calor durante la aplicación.",
      preparados: [
        { nombre: "Filvit Neo loción 4%", conc_mg_ml: null },
        { nombre: "Neositrin gel líquido 100%", conc_mg_ml: null },
        { nombre: "Fullmarks loción 4%", conc_mg_ml: null },
        { nombre: "Paranix loción", conc_mg_ml: null }
      ]
    },
    info: {
      indicaciones: [
        "Pediculosis capitis (primera línea pediátrica)",
        "Pediculosis corporis (uso ocasional)"
      ],
      contraindicaciones: [
        "Hipersensibilidad a los excipientes",
        "Lesiones extensas del cuero cabelludo, dermatitis exudativa"
      ],
      precauciones: [
        "Inflamable: no exponer a llamas, secador caliente o cigarrillos durante la aplicación",
        "Evitar contacto con ojos (en caso de contacto, lavar abundantemente)",
        "Sin actividad ovicida absoluta: imprescindible repetir aplicación a los 7-10 días",
        "Complementar con peinado con lendrera 2-3 veces/semana × 2 semanas",
        "Examinar a convivientes y tratar simultáneamente a los afectos"
      ]
    }
  },

  {
    nombre: "DOBUTAMINA",
    categoria: "Reanimación / UCIP",
    sinonimos: ["dobutamina", "dobutrex"],
    isoColor: ISO.cardio,
    icono: "🫀",
    vias: ["iv", "io"],
    modos: ["perfusion"],
    fuente: "Pediamécum",
    presentaciones: [
      {
        label: "250 mg / 250 ml SG5%",
        dosis_mg: 250, dilucion_ml: 250, suero: "Dx5%",
        concUgMl: (250 * 1000) / 250,           // 1000 mcg/ml
        dosisRange: "2,5 – 20 mcg/kg/min",
        dosisMin: 2.5, softMax: 20, hardMax: 25,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      },
      {
        label: "500 mg / 250 ml SG5%",
        dosis_mg: 500, dilucion_ml: 250, suero: "Dx5%",
        concUgMl: (500 * 1000) / 250,           // 2000 mcg/ml
        dosisRange: "2,5 – 20 mcg/kg/min",
        dosisMin: 2.5, softMax: 20, hardMax: 25,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      }
    ],
    info: {
      indicaciones: [
        "Shock cardiogénico",
        "Disfunción ventricular en shock séptico (con noradrenalina/adrenalina)",
        "Bajo gasto postcirugía cardíaca"
      ],
      contraindicaciones: [
        "Miocardiopatía hipertrófica obstructiva",
        "Estenosis aórtica grave"
      ],
      precauciones: [
        "Taquicardia y arritmias a dosis altas",
        "Vía central preferible para perfusión continua",
        "Vigilar TA: efecto inotrópico predominante, pero puede causar hipotensión por vasodilatación"
      ]
    }
  },

  {
    nombre: "DOMPERIDONA",
    categoria: "Antiemético",
    sinonimos: ["motilium", "domperidona"],
    isoColor: ISO.digestivo,
    icono: "🤢",
    vias: ["oral"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP) / AEMPS",
    intermitente: [
      {
        indicacion: "Náuseas y vómitos (uso restringido por AEMPS)",
        via: "oral",
        dosis_mg_kg: 0.25,
        intervalo_h: 8,
        dosis_max_mg: 10,
        dosis_max_dia_mg: 30,
        duracion: "Máximo 7 días",
        nota: "⚠️ **Uso restringido (AEMPS 2014)** por riesgo de arritmias ventriculares y prolongación del QT. Solo para náuseas y vómitos (ya NO para reflujo ni trastornos de motilidad). Dosis: 0,25 mg/kg hasta 3 veces al día (máx. 0,75 mg/kg/día; máx. 10 mg/dosis). Duración máxima 7 días. **Restringido a niños y adolescentes** con peso bajo control; usar la dosis eficaz más baja durante el menor tiempo posible. La mayoría de los vómitos del lactante no requieren tratamiento farmacológico.",
        preparados: [
          { nombre: "Motilium suspensión 1 mg/ml", conc_mg_ml: 1 },
          { nombre: "Motilium comprimidos 10 mg", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Náuseas y vómitos (único uso autorizado tras restricción AEMPS)"
      ],
      contraindicaciones: [
        "Prolongación del QT, cardiopatía con riesgo de arritmia",
        "Insuficiencia hepática moderada-grave",
        "Uso concomitante con inhibidores potentes del CYP3A4 o fármacos que prolongan QT",
        "Hemorragia, obstrucción o perforación gastrointestinal",
        "Prolactinoma"
      ],
      precauciones: [
        "Riesgo de arritmia ventricular y muerte súbita (dosis-dependiente): dosis mínima eficaz, duración ≤ 7 días",
        "Vigilar ionograma (hipopotasemia/hipomagnesemia aumentan riesgo QT)",
        "Síntomas extrapiramidales (raros, más en sobredosis)",
        "Galactorrea, ginecomastia (efecto prolactínico)",
        "En vómitos por gastroenteritis, el ondansetrón tiene mejor perfil de evidencia/seguridad"
      ]
    }
  },

  {
    nombre: "DOPAMINA",
    categoria: "Reanimación / UCIP",
    sinonimos: ["dopamina"],
    isoColor: ISO.cardio,
    icono: "🫀",
    vias: ["iv", "io"],
    modos: ["perfusion"],
    fuente: "Pediamécum",
    presentaciones: [
      {
        label: "200 mg / 250 ml SG5%",
        dosis_mg: 200, dilucion_ml: 250, suero: "Dx5%",
        concUgMl: (200 * 1000) / 250,           // 800 mcg/ml
        dosisRange: "5 – 20 mcg/kg/min",
        dosisMin: 2, softMax: 20, hardMax: 25,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      },
      {
        label: "200 mg / 100 ml SG5% (concentrada)",
        dosis_mg: 200, dilucion_ml: 100, suero: "Dx5%",
        concUgMl: (200 * 1000) / 100,           // 2000 mcg/ml
        dosisRange: "5 – 20 mcg/kg/min",
        dosisMin: 2, softMax: 20, hardMax: 25,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      }
    ],
    info: {
      indicaciones: [
        "Shock distributivo, cardiogénico (alternativa)",
        "Bradicardia sintomática refractaria a atropina"
      ],
      contraindicaciones: [
        "Feocromocitoma",
        "Taquiarritmias ventriculares no controladas"
      ],
      precauciones: [
        "Vía central a dosis > 5 mcg/kg/min (necrosis por extravasación)",
        "Disminución del flujo prolactínico (importante en lactantes-prematuros)",
        "Las guías recientes prefieren adrenalina o noradrenalina en shock pediátrico"
      ]
    }
  },

  // ── E ─────────────────────────────────────────────────────
  {
    nombre: "EMLA (LIDOCAÍNA + PRILOCAÍNA)",
    categoria: "Analgesia / Sedación",
    sinonimos: ["emla", "lidocaina prilocaina", "anestesico topico", "crema anestesica"],
    isoColor: ISO.neuro,
    icono: "🧴",
    vias: ["top"],
    modos: ["puntual"],
    fuente: "Pediamécum (AEP)",
    puntual: {
      descripcion: "Anestesia tópica para punciones y procedimientos cutáneos",
      dosis_fija_mg: 0,
      via: "Tópica — aplicar capa gruesa bajo apósito oclusivo",
      nota: "Crema de lidocaína 2,5% + prilocaína 2,5%. Aplicar capa gruesa (≈ 1-2 g por zona) cubierta con apósito oclusivo. **Tiempo de actuación: 60 min** antes de punción venosa/capilar; **120 min** para procedimientos más profundos (retirar 15 min antes). **Dosis máxima por riesgo de metahemoglobinemia (prilocaína)**: 0-3 meses o < 5 kg → máx. 1 g y 10 cm², ≤ 1 h. 3-12 meses y > 5 kg → máx. 2 g y 20 cm². 1-6 años y > 10 kg → máx. 10 g y 100 cm². 6-12 años y > 20 kg → máx. 20 g y 200 cm². No aplicar sobre mucosas, heridas abiertas ni piel atópica extensa.",
      preparados: [
        { nombre: "EMLA crema 5% (lidocaína 25 mg/g + prilocaína 25 mg/g)", conc_mg_ml: null },
        { nombre: "EMLA parche (1 g, 10 cm²)", conc_mg_ml: null }
      ]
    },
    info: {
      indicaciones: [
        "Anestesia previa a punción venosa, capilar o arterial",
        "Punción lumbar, paracentesis, artrocentesis (analgesia superficial)",
        "Curas, desbridamiento superficial, retirada de moluscos",
        "Vacunación en niños con fobia a agujas (uso individualizado)"
      ],
      contraindicaciones: [
        "Metahemoglobinemia congénita o idiopática",
        "Hipersensibilidad a anestésicos locales tipo amida",
        "Prematuros < 37 semanas",
        "Heridas abiertas, mucosas, ojos"
      ],
      precauciones: [
        "Metahemoglobinemia (prilocaína) — respetar dosis y tiempo máximos, sobre todo en lactantes < 3 meses",
        "No superar la superficie ni el tiempo de aplicación recomendados",
        "Precaución con otros fármacos metahemoglobinizantes (sulfamidas, nitratos, paracetamol a dosis altas)",
        "Palidez o eritema local transitorios en la zona de aplicación",
        "Vasoconstricción inicial seguida de vasodilatación: puede dificultar la canalización si se retira tarde"
      ]
    }
  },

  {
    nombre: "ENALAPRIL",
    categoria: "Cardiología",
    sinonimos: ["enalapril", "renitec", "naprilene"],
    isoColor: ISO.cardio,
    icono: "💊",
    vias: ["oral", "iv"],
    modos: ["intermitente"],
    fuente: "Pediamécum",
    intermitente: [
      {
        indicacion: "HTA / Insuficiencia cardíaca (oral)",
        via: "oral",
        dosis_mg_kg: 0.1,
        intervalo_h: 24,
        dosis_max_mg: 40,
        nota: "Iniciar 0,08-0,1 mg/kg/día en 1-2 tomas (máx. 5 mg/día inicial). Titular semanal hasta 0,6 mg/kg/día (máx. 40 mg/día). Inicio del efecto en 1 h, pico 4-6 h. Más cómodo que captopril por dosificación diaria/12 h.",
        preparados: [
          { nombre: "Enalapril comp. 5 / 20 mg", conc_mg_ml: null },
          { nombre: "Enalapril fórmula magistral 1 mg/ml", conc_mg_ml: 1 }
        ]
      },
      {
        indicacion: "Crisis hipertensiva (IV, enalaprilato)",
        via: "iv",
        dosis_mg_kg: 0.01,
        intervalo_h: 6,
        dosis_max_mg: 1.25,
        nota: "Enalaprilato 5-10 mcg/kg/dosis IV en 5-10 min (máx. 1,25 mg). Repetir cada 8-24 h. Efecto en 15 min, máximo a 1-4 h. Uso restringido a UCIP."
      }
    ],
    info: {
      indicaciones: [
        "HTA pediátrica (alternativa más cómoda al captopril)",
        "Insuficiencia cardíaca con disfunción sistólica",
        "Nefropatía con proteinuria",
        "Cardiopatías congénitas con disfunción ventricular"
      ],
      contraindicaciones: [
        "Estenosis bilateral de arteria renal",
        "Hipersensibilidad a IECA, angioedema previo",
        "Embarazo (no aplicable en este contexto pero relevante en adolescentes)",
        "Insuficiencia renal aguda"
      ],
      precauciones: [
        "Hipotensión de primera dosis: iniciar dosis baja",
        "Tos seca, hiperpotasemia",
        "Deterioro de función renal — vigilar creatinina e iones",
        "No combinar con suplementos de potasio o diuréticos ahorradores sin monitorización"
      ]
    }
  },

  {
    nombre: "ENOXAPARINA",
    categoria: "Hematología",
    sinonimos: ["clexane", "enoxaparina"],
    isoColor: ISO.neutral,
    icono: "💉",
    vias: ["sc", "iv"],
    modos: ["intermitente"],
    fuente: "Pediamécum",
    intermitente: [
      {
        indicacion: "Tratamiento de trombosis (peso ajustado por edad)",
        via: "sc",
        dosis_mg_kg: 1,
        intervalo_h: 12,
        nota: "< 2 meses: 1,5 mg/kg/dosis cada 12 h. ≥ 2 meses: 1 mg/kg/dosis cada 12 h. Monitorizar anti-Xa (objetivo 0,5-1 UI/ml medido 4 h post-dosis). Vía SC en cara anterolateral del muslo o abdomen.",
        preparados: [
          { nombre: "Clexane jeringa precargada 20/40/60/80/100/120/150 mg", conc_mg_ml: 100 }
        ]
      },
      {
        indicacion: "Profilaxis",
        via: "sc",
        dosis_mg_kg: 0.5,
        intervalo_h: 24,
        dosis_max_mg: 40,
        nota: "< 2 meses: 0,75 mg/kg/dosis cada 12-24 h. ≥ 2 meses: 0,5 mg/kg/dosis cada 12-24 h (máx. 40 mg/día).",
        preparados: [
          { nombre: "Clexane jeringa precargada 20/40 mg", conc_mg_ml: 100 }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Trombosis venosa profunda y tromboembolismo pulmonar",
        "Profilaxis tromboembólica en adolescentes hospitalizados con factores de riesgo",
        "Síndrome nefrótico con riesgo trombótico",
        "Cardiopatía con riesgo embolígeno"
      ],
      contraindicaciones: [
        "Hemorragia activa significativa",
        "Coagulopatía no corregida",
        "Trombocitopenia inducida por heparina (HIT)",
        "Cirugía reciente del SNC u oftalmológica"
      ],
      precauciones: [
        "Monitorización de anti-Xa especialmente en < 1 año, obesidad o IRC",
        "Trombocitopenia (vigilar plaquetas)",
        "Antídoto parcial: sulfato de protamina (1 mg por cada 1 mg de enoxaparina si < 8 h)",
        "Hematomas en el sitio de inyección"
      ]
    }
  },

  {
    nombre: "ERITROMICINA",
    categoria: "Antibiótico",
    sinonimos: ["eritromicina", "pantomicina"],
    isoColor: ISO.antibiotico,
    icono: "💊",
    vias: ["oral", "iv"],
    modos: ["intermitente"],
    fuente: "Pediamécum / AEP",
    intermitente: [
      {
        indicacion: "Tos ferina / Conjuntivitis neonatal por Chlamydia",
        via: "oral",
        dosis_mg_kg_dia: 50,
        intervalo_h: 6,
        dosis_max_dia_mg: 2000,
        duracion: "Tos ferina 14 días; conjuntivitis/neumonía por C. trachomatis 14 días",
        nota: "40-50 mg/kg/día divididos cada 6 h (máx. 2 g/día). Alternativa: azitromicina (preferida en lactantes < 1 mes por riesgo de estenosis hipertrófica del píloro con eritromicina). Profilaxis postexposición tos ferina: misma pauta × 14 días.",
        preparados: [
          { nombre: "Pantomicina suspensión 250 mg/5 ml (50 mg/ml)", conc_mg_ml: 50 },
          { nombre: "Pantomicina suspensión 500 mg/5 ml (100 mg/ml)", conc_mg_ml: 100 },
          { nombre: "Pantomicina comp. 500 mg", conc_mg_ml: null }
        ]
      },
      {
        indicacion: "Estimulación de la motilidad gastrointestinal (uso especializado)",
        via: "oral",
        dosis_mg_kg: 3,
        intervalo_h: 8,
        dosis_max_mg: 250,
        nota: "Dosis bajas (3-5 mg/kg/dosis c/6-8 h) como procinético en gastroparesia o intolerancia a la alimentación enteral. Uso especializado en neonatología y UCIP. Evitar uso prolongado por taquifilaxia y desarrollo de resistencias bacterianas."
      }
    ],
    info: {
      indicaciones: [
        "Tos ferina (alternativa a azitromicina, especialmente > 1 mes)",
        "Conjuntivitis y neumonía neonatal por Chlamydia trachomatis",
        "Faringoamigdalitis o infecciones cutáneas en alérgicos a betalactámicos (alternativa)",
        "Procinético en gastroparesia (uso a dosis bajas)",
        "Profilaxis ocular del recién nacido (pomada 0,5%, no IV/oral)"
      ],
      contraindicaciones: [
        "Hipersensibilidad a macrólidos",
        "Hepatopatía grave",
        "Uso concomitante con QT-prolongadores potentes",
        "Lactantes < 2 semanas (riesgo de estenosis hipertrófica del píloro — usar azitromicina)"
      ],
      precauciones: [
        "Estenosis hipertrófica del píloro en < 2 semanas (asociación clara, riesgo 8-10x)",
        "Prolongación QTc, arritmias ventriculares",
        "Hepatotoxicidad (hepatitis colestásica)",
        "Múltiples interacciones (inhibidor CYP3A4: aumenta niveles de teofilina, carbamazepina, ciclosporina)"
      ]
    }
  },

  {
    nombre: "ESMOLOL",
    categoria: "Cardiología",
    sinonimos: ["brevibloc", "esmolol"],
    isoColor: ISO.cardio,
    icono: "🫀",
    vias: ["iv"],
    modos: ["carga_mantenimiento"],
    fuente: "Pediamécum / UCIP",
    carga: {
      descripcion: "Taquiarritmia supraventricular / Crisis hipertensiva",
      dosis_mcg_kg: 500,
      tiempo_min: 1,
      via: "IV en 1 minuto",
      nota: "Carga 100-500 mcg/kg en 1 min. Mantenimiento: iniciar 50 mcg/kg/min y titular cada 5-10 min hasta 200-300 mcg/kg/min según respuesta. Vida media muy corta (~9 min): titulación rápida posible."
    },
    presentaciones: [
      {
        label: "2500 mg / 250 ml SG5%",
        dosis_mg: 2500, dilucion_ml: 250, suero: "Dx5%",
        concUgMl: (2500 * 1000) / 250,          // 10000 mcg/ml
        dosisRange: "50 – 300 mcg/kg/min",
        dosisMin: 25, softMax: 300, hardMax: 500,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      }
    ],
    info: {
      indicaciones: [
        "Taquicardia supraventricular postoperatoria",
        "Control de la frecuencia ventricular en taquiarritmias",
        "Crisis hipertensiva intra/postoperatoria",
        "Tetralogía de Fallot — crisis hipoxémica (uso muy específico)"
      ],
      contraindicaciones: [
        "Bradicardia sinusal grave",
        "Bloqueo AV 2.º-3.er grado sin marcapasos",
        "Shock cardiogénico",
        "Insuficiencia cardíaca descompensada"
      ],
      precauciones: [
        "Hipotensión y bradicardia frecuentes — monitorización continua",
        "Broncoespasmo en asmáticos (más cardioselectivo que otros betabloqueantes pero precaución)",
        "Vida media muy corta: el efecto desaparece en 10-20 min al suspender",
        "Hipoglucemia (especialmente en lactantes/desnutridos)"
      ]
    }
  },

  {
    nombre: "ESPIRONOLACTONA",
    categoria: "Diurético",
    sinonimos: ["aldactone", "espironolactona"],
    isoColor: ISO.cardio,
    icono: "💧",
    vias: ["oral"],
    modos: ["intermitente"],
    fuente: "Pediamécum",
    intermitente: [
      {
        indicacion: "Insuficiencia cardíaca / Edema / Hiperaldosteronismo",
        via: "oral",
        dosis_mg_kg_dia: 2,
        intervalo_h: 12,
        dosis_max_dia_mg: 200,
        nota: "1-3 mg/kg/día divididos en 1-2 tomas (máx. 100-200 mg/día). Diurético ahorrador de potasio: vigilar K+. Inicio del efecto en 2-3 días. Útil en ICC con disfunción ventricular (reduce mortalidad), ascitis por hepatopatía, hiperaldosteronismo, displasia broncopulmonar (asociado a clorotiazida).",
        preparados: [
          { nombre: "Aldactone comp. 25 / 100 mg", conc_mg_ml: null },
          { nombre: "Espironolactona fórmula magistral susp. 5 mg/ml", conc_mg_ml: 5 }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Insuficiencia cardíaca con disfunción sistólica (reduce mortalidad)",
        "Edema/ascitis por hepatopatía o síndrome nefrótico",
        "Hiperaldosteronismo primario o secundario",
        "Displasia broncopulmonar (en asociación con clorotiazida)",
        "Acné moderado-grave en adolescentes (uso androgénico)"
      ],
      contraindicaciones: [
        "Hiperpotasemia",
        "Insuficiencia renal grave (anuria, FG < 30 ml/min)",
        "Enfermedad de Addison",
        "Uso concomitante con eplerenona u otros antagonistas de aldosterona"
      ],
      precauciones: [
        "Hiperpotasemia (vigilar K+, evitar suplementos de potasio o IECA sin monitorización)",
        "Ginecomastia, mastodinia (efecto antiandrogénico)",
        "Acidosis metabólica hiperclorémica leve",
        "Inicio de acción lento (2-3 días)"
      ]
    }
  },

  // ── F ─────────────────────────────────────────────────────
  {
    nombre: "FENAZONA + LIDOCAÍNA ÓTICA",
    categoria: "Otorrinolaringología",
    sinonimos: ["otitex", "otalgan", "fenazona lidocaina", "gotas oido dolor"],
    isoColor: ISO.analgesia,
    icono: "👂",
    vias: ["top"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Otalgia en otitis media con tímpano íntegro",
        via: "top",
        dosis_fija_mg: 0,
        intervalo_h: 8,
        duracion: "1-3 días (analgesia sintomática)",
        nota: "Gotas óticas con fenazona (analgésico) + lidocaína o clorhidrato de procaína (anestésico local). **Posología**: 3-4 gotas en el conducto auditivo del oído afecto cada 6-8 h durante 1-3 días, solo para alivio del dolor. ⚠️ **CONTRAINDICADO si hay perforación timpánica o tubos de drenaje** (la lidocaína no debe contactar con el oído medio). Verificar SIEMPRE la integridad del tímpano (otoscopia) antes de prescribir. Es un tratamiento sintomático del dolor, NO trata la infección — la otitis media puede requerir antibiótico sistémico según criterios.",
        preparados: [
          { nombre: "Otitex gotas óticas (fenazona + lidocaína)", conc_mg_ml: null },
          { nombre: "Otalgan gotas óticas", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Alivio sintomático de la otalgia en otitis media aguda con tímpano íntegro",
        "Dolor en otitis externa leve (con tímpano íntegro)",
        "Analgesia previa a la extracción de tapón de cerumen"
      ],
      contraindicaciones: [
        "Perforación timpánica o tubos de timpanostomía (drenajes)",
        "Hipersensibilidad a fenazona (pirazolonas) o anestésicos locales",
        "Otorrea (sugiere perforación)"
      ],
      precauciones: [
        "Verificar integridad timpánica con otoscopia ANTES de instilar",
        "Es analgesia sintomática: no sustituye al tratamiento etiológico de la otitis",
        "No usar más de 3 días sin reevaluación",
        "Calentar el frasco entre las manos antes de instilar (evita vértigo)"
      ]
    }
  },

  {
    nombre: "FAMOTIDINA",
    categoria: "Digestivo",
    sinonimos: ["famotidina", "pepcid", "tamin"],
    isoColor: ISO.digestivo,
    icono: "💊",
    vias: ["oral", "iv"],
    modos: ["intermitente"],
    fuente: "Pediamécum",
    intermitente: [
      {
        indicacion: "ERGE / Úlcera péptica (oral)",
        via: "oral",
        dosis_mg_kg: 0.5,
        intervalo_h: 12,
        dosis_max_mg: 40,
        nota: "0,5-1 mg/kg/dosis cada 12 h (máx. 40 mg/dosis, 80 mg/día). 3 meses-1 año: 0,5 mg/kg c/12 h. Alternativa a omeprazol cuando éste no se tolera o se prefiere antiH2. La ranitidina fue retirada en 2020 (contaminación con NDMA); famotidina es la alternativa actual.",
        preparados: [
          { nombre: "Famotidina comp. 20 / 40 mg", conc_mg_ml: null },
          { nombre: "Famotidina fórmula magistral susp. 8 mg/ml", conc_mg_ml: 8 }
        ]
      },
      {
        indicacion: "Profilaxis úlcera de estrés (IV)",
        via: "iv",
        dosis_mg_kg: 0.25,
        intervalo_h: 12,
        dosis_max_mg: 20,
        nota: "0,25-0,5 mg/kg/dosis cada 12 h IV (máx. 40 mg/día). Administrar en 15-30 min."
      }
    ],
    info: {
      indicaciones: [
        "ERGE con esofagitis",
        "Úlcera péptica gástrica o duodenal",
        "Profilaxis de úlcera de estrés en críticos",
        "Coadyuvante en anafilaxia (efecto antiH2)"
      ],
      contraindicaciones: [
        "Hipersensibilidad a antiH2"
      ],
      precauciones: [
        "Ajustar dosis en insuficiencia renal moderada-grave",
        "Bien tolerado, efectos adversos raros",
        "Taquifilaxia rápida con uso prolongado (menos eficaz que IBP en ERGE grave)",
        "Sustituye a la ranitidina (retirada por contaminación con NDMA)"
      ]
    }
  },

  {
    nombre: "FENITOÍNA",
    categoria: "Antiepiléptico / Sedante",
    sinonimos: ["fenitoina", "fenitoína", "epanutin"],
    isoColor: ISO.neuro,
    icono: "🧠",
    vias: ["iv", "oral"],
    modos: ["carga_mantenimiento"],
    fuente: "SEUP / Pediamécum",
    carga: {
      descripcion: "Estatus epiléptico refractario a benzodiacepinas",
      dosis_mg_kg: 20,
      tiempo_min: 20,
      via: "IV en SSF (precipita con SG5%), velocidad máxima 1 mg/kg/min (máx. 50 mg/min). Vía propia, NO mezclar.",
      nota: "Dosis máx. carga 1500 mg. Levetiracetam suele preferirse hoy por mejor perfil de seguridad. Monitorización ECG continua durante la infusión (hipotensión, arritmias). Extravasación: síndrome del guante púrpura. Mantenimiento: 5-8 mg/kg/día divididos cada 12 h."
    },
    intermitente: [
      {
        indicacion: "Mantenimiento antiepiléptico (oral)",
        via: "oral",
        dosis_mg_kg_dia: 6,
        intervalo_h: 12,
        dosis_max_dia_mg: 400,
        nota: "5-10 mg/kg/día divididos cada 12 h. Niveles diana 10-20 mg/L. Cinética no lineal: pequeños cambios de dosis pueden producir toxicidad.",
        preparados: [
          { nombre: "Epanutin suspensión 30 mg/5 ml (6 mg/ml)", conc_mg_ml: 6 },
          { nombre: "Epanutin cápsulas 100 mg", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Estatus epiléptico (alternativa a levetiracetam)",
        "Mantenimiento de epilepsias focales y generalizadas tónico-clónicas",
        "Profilaxis de crisis postraumáticas"
      ],
      contraindicaciones: [
        "Bloqueo AV 2.º-3.er grado",
        "Bradicardia sinusal grave",
        "Síndrome de Stevens-Johnson previo con fenitoína"
      ],
      precauciones: [
        "Hipotensión, arritmias y asistolia con infusión rápida — monitorización ECG",
        "Extravasación: necrosis grave / síndrome del guante púrpura",
        "Hiperplasia gingival, hirsutismo en uso crónico",
        "Múltiples interacciones (inductor enzimático)"
      ]
    }
  },

  {
    nombre: "FENOBARBITAL",
    categoria: "Antiepiléptico / Sedante",
    sinonimos: ["luminal", "fenobarbital", "gardenal"],
    isoColor: ISO.neuro,
    icono: "🧠",
    vias: ["iv", "oral", "im"],
    modos: ["carga_mantenimiento"],
    fuente: "Neofax / SEUP / Pediamécum",
    carga: {
      descripcion: "Crisis convulsiva neonatal / Estatus refractario",
      dosis_mg_kg: 20,
      tiempo_min: 20,
      via: "IV lento (máx. 1 mg/kg/min en niños, 2 mg/kg/min en neonatos)",
      nota: "Primera línea en convulsiones neonatales. Dosis carga 20 mg/kg; si persiste, puede repetirse 10 mg/kg hasta total 40 mg/kg. Niveles diana 15-40 mg/L. Mantenimiento: 3-5 mg/kg/día (neonato hasta 5 mg/kg/día) en 1-2 dosis."
    },
    intermitente: [
      {
        indicacion: "Mantenimiento antiepiléptico",
        via: "oral",
        dosis_mg_kg_dia: 4,
        intervalo_h: 12,
        nota: "3-5 mg/kg/día en 1-2 dosis. Iniciar dosis de mantenimiento 12-24 h tras la carga. Niveles diana 15-40 mg/L.",
        preparados: [
          { nombre: "Luminal comp. 100 mg", conc_mg_ml: null },
          { nombre: "Gardenal comp. 50 mg", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Crisis convulsivas neonatales (primera elección)",
        "Estatus epiléptico (tercera línea tras benzodiacepinas y levetiracetam/fenitoína)",
        "Mantenimiento antiepiléptico (menos usado actualmente)"
      ],
      contraindicaciones: [
        "Porfiria",
        "Insuficiencia respiratoria grave sin soporte",
        "Hipersensibilidad a barbitúricos"
      ],
      precauciones: [
        "Depresión respiratoria y sedación profunda con dosis altas",
        "Sedación residual prolongada (vida media muy larga)",
        "Inductor enzimático potente (interacciones)",
        "Hiperactividad paradójica en niños"
      ]
    }
  },

  {
    nombre: "FENTANILO",
    categoria: "Analgesia / Sedación",
    sinonimos: ["fentanilo", "fentanyl"],
    isoColor: ISO.analgesia,
    icono: "💊",
    vias: ["iv", "im"],
    modos: ["puntual", "perfusion"],
    fuente: "Pediamécum / SEUP",
    puntual: {
      descripcion: "Analgesia / sedación para procedimientos",
      dosis_mcg_kg: 1,
      via: "IV lenta 1-2 mcg/kg (máx. 50-100 mcg/dosis). Intranasal: 1,5-2 mcg/kg (máx. 100 mcg).",
      nota: "Inicio de acción 2-3 min IV, 5-10 min IN. Duración 30-60 min. Riesgo de rigidez torácica con bolos rápidos (administrar en 2-3 min). Disponer de naloxona."
    },
    presentaciones: [
      {
        label: "0,5 mg / 50 ml SG5% (UCIP)",
        dosis_mg: 0.5, dilucion_ml: 50, suero: "Dx5%",
        concUgMl: (0.5 * 1000) / 50,            // 10 mcg/ml
        dosisRange: "1 – 5 mcg/kg/h",
        dosisMin: 0.5, softMax: 5, hardMax: 10,
        unidad: "mcg/kg/h", calcTipo: "mcg_kg_h"
      }
    ],
    info: {
      indicaciones: [
        "Analgesia procedimientos (intranasal especialmente útil)",
        "Sedoanalgesia en UCIP",
        "Analgesia perioperatoria"
      ],
      contraindicaciones: [
        "Hipersensibilidad conocida",
        "Depresión respiratoria preexistente sin soporte"
      ],
      precauciones: [
        "Depresión respiratoria y apnea — material de RCP disponible",
        "Rigidez torácica con bolos rápidos",
        "Tolerancia rápida en perfusión continua",
        "Antídoto: naloxona"
      ]
    }
  },

  {
    nombre: "FUROSEMIDA",
    categoria: "Diurético",
    sinonimos: ["seguril", "furosemida"],
    isoColor: ISO.cardio,
    icono: "💧",
    vias: ["iv", "oral", "im"],
    modos: ["intermitente"],
    fuente: "Pediamécum",
    intermitente: [
      {
        indicacion: "Edema / Insuficiencia cardíaca / Hipervolemia",
        via: "iv",
        dosis_mg_kg: 1,
        intervalo_h: 12,
        dosis_max_mg: 40,
        nota: "0,5-2 mg/kg/dosis. IV directa lenta (no superar 0,5 mg/kg/min). Repetir según respuesta. Considerar perfusión continua en UCIP a 0,05-0,4 mg/kg/h."
      },
      {
        indicacion: "Mantenimiento oral",
        via: "oral",
        dosis_mg_kg: 1,
        intervalo_h: 12,
        dosis_max_mg: 40,
        nota: "1-6 mg/kg/día divididos en 2-4 dosis. Vigilar K+ y función renal.",
        preparados: [
          { nombre: "Furosemida susp. 1 mg/ml (fórmula magistral)", conc_mg_ml: 1 }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Sobrecarga de volumen / edema agudo de pulmón",
        "Insuficiencia cardíaca congestiva",
        "Edema renal / hepático",
        "Hipertensión arterial (raro en pediatría)"
      ],
      contraindicaciones: [
        "Anuria por insuficiencia renal aguda obstructiva",
        "Hipovolemia / depleción hidroelectrolítica grave",
        "Alergia a sulfamidas (relativa)"
      ],
      precauciones: [
        "Vigilar K+, Na+, Mg2+, función renal",
        "Ototoxicidad con dosis altas o IV rápida (especialmente en neonatos)",
        "Hipotensión postural",
        "Nefrocalcinosis en uso prolongado en lactantes"
      ]
    }
  },

  {
    nombre: "FEXOFENADINA",
    categoria: "Antihistamínico",
    sinonimos: ["telfast", "fexofenadina"],
    isoColor: ISO.respiratorio,
    icono: "🤧",
    vias: ["oral"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Rinitis alérgica / urticaria crónica idiopática",
        via: "oral",
        dosis_fija_mg: 30,
        intervalo_h: 12,
        nota: "Antihistamínico H1 de 2.ª generación, no sedante. Pauta por edad: 6 meses-2 años → 15 mg/12 h; 2-11 años → 30 mg/12 h; ≥ 12 años → 60 mg/12 h o 120 mg/24 h (rinitis), hasta 180 mg/24 h (urticaria crónica). Inicio efecto en 1 h, duración 12-24 h. Metabolito activo de la terfenadina, sin riesgo de prolongación QT.",
        preparados: [
          { nombre: "Telfast comp. 30 / 60 / 120 / 180 mg", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Rinitis alérgica estacional (≥ 6 meses)",
        "Urticaria crónica idiopática (≥ 6 meses)"
      ],
      contraindicaciones: [
        "Hipersensibilidad al fármaco"
      ],
      precauciones: [
        "Bien tolerado; cefalea, somnolencia y náuseas raras",
        "Sin efecto significativo sobre QTc",
        "Evitar zumo de fruta (especialmente pomelo, naranja, manzana): reduce absorción",
        "Ajustar dosis en insuficiencia renal grave"
      ]
    }
  },

  {
    nombre: "FLUCONAZOL",
    categoria: "Antibiótico",
    sinonimos: ["fluconazol", "diflucan", "loitin"],
    isoColor: ISO.antibiotico,
    icono: "🦠",
    vias: ["iv", "oral"],
    modos: ["intermitente"],
    fuente: "Pediamécum",
    intermitente: [
      {
        indicacion: "Candidiasis invasiva (carga + mantenimiento)",
        via: "iv",
        dosis_mg_kg: 12,
        intervalo_h: 24,
        dosis_max_mg: 800,
        nota: "Carga 25 mg/kg el primer día, después 12 mg/kg/día (máx. 800 mg/día). Administrar en 1-2 h. Indicada en candidemia, candidiasis invasiva en > 1 mes. En neonatos: 12 mg/kg/dosis pero intervalo según EG y EPN (24-72 h).",
        preparados: [
          { nombre: "Diflucan susp. 50 mg/5 ml (10 mg/ml)", conc_mg_ml: 10 },
          { nombre: "Diflucan susp. 200 mg/5 ml (40 mg/ml)", conc_mg_ml: 40 },
          { nombre: "Diflucan cápsulas 50 / 100 / 150 / 200 mg", conc_mg_ml: null }
        ]
      },
      {
        indicacion: "Candidiasis orofaríngea / esofágica",
        via: "oral",
        dosis_mg_kg: 6,
        intervalo_h: 24,
        dosis_max_mg: 400,
        duracion: "7-14 días",
        nota: "Carga 6 mg/kg primer día, después 3-6 mg/kg/día (máx. 400 mg). Candidiasis mucocutánea: 3 mg/kg/día × 7-14 días.",
        preparados: [
          { nombre: "Diflucan susp. 50 mg/5 ml (10 mg/ml)", conc_mg_ml: 10 }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Candidemia y candidiasis invasiva no resistente",
        "Candidiasis orofaríngea, esofágica, mucocutánea",
        "Profilaxis antifúngica en hospedador inmunocomprometido seleccionado",
        "Meningitis criptocócica (mantenimiento tras fase inicial con anfo)"
      ],
      contraindicaciones: [
        "Hipersensibilidad a azoles",
        "Uso concomitante con QT-prolongadores potentes (cisaprida, terfenadina)"
      ],
      precauciones: [
        "Hepatotoxicidad: vigilar transaminasas con uso prolongado",
        "Prolongación del QTc",
        "Múltiples interacciones (inhibidor CYP2C9, 2C19, 3A4): warfarina, fenitoína, ciclosporina",
        "Ajuste de dosis en insuficiencia renal (intervalo más largo)"
      ]
    }
  },

  {
    nombre: "FLUTICASONA FUROATO NASAL",
    categoria: "Respiratorio",
    sinonimos: ["avamys", "fluticasona nasal", "fluticasona furoato"],
    isoColor: ISO.respiratorio,
    icono: "👃",
    vias: ["in"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Rinitis alérgica — pauta por edad",
        via: "in",
        dosis_fija_mg: 0,
        intervalo_h: 24,
        nota: "Espray nasal acuoso 27,5 mcg/aplicación. Pauta: 2-11 años → 1 aplicación en cada fosa nasal una vez al día (= 55 mcg/día). ≥ 12 años → 2 aplicaciones en cada fosa una vez al día (= 110 mcg/día) hasta control, después reducir a 1 aplicación/fosa. Edad mínima 2 años. Agitar antes de cada uso y mantener la cabeza ligeramente inclinada hacia adelante.",
        preparados: [
          { nombre: "Avamys espray nasal 27,5 mcg/pulsación (120 dosis)", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Rinitis alérgica estacional y perenne (≥ 2 años)",
        "Síntomas oculares asociados a rinitis alérgica"
      ],
      contraindicaciones: [
        "Hipersensibilidad al fármaco",
        "Infección activa de la mucosa nasal (sin tratar)"
      ],
      precauciones: [
        "Epistaxis (frecuente), irritación nasal, cefalea",
        "Candidiasis nasofaríngea con uso prolongado (poco frecuente con corticoides nasales)",
        "Vigilar crecimiento en uso prolongado y dosis altas",
        "Supresión suprarrenal con dosis muy altas (raro a dosis recomendadas)"
      ]
    }
  },

  {
    nombre: "FLUTICASONA PROPIONATO TÓPICO",
    categoria: "Dermatología",
    sinonimos: ["cutivate", "flunutrac", "fluticasona crema", "fluticasona topica"],
    isoColor: ISO.respiratorio,
    icono: "🧴",
    vias: ["top"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Dermatitis atópica moderada-grave / eccema",
        via: "top",
        dosis_fija_mg: 0,
        intervalo_h: 24,
        duracion: "Hasta 2 semanas (revaluar)",
        nota: "Corticoide tópico de potencia moderada-alta (grupo III europeo). Crema 0,05% o pomada 0,005%. Aplicar capa fina sobre la lesión 1 vez al día (la pomada puede aplicarse 1-2 veces/día). Edad mínima 1 año. Indicado en dermatitis atópica moderada-grave que no responde a hidrocortisona, o como tratamiento de los brotes. Evitar cara, pliegues, zona del pañal y oclusión prolongada. NO confundir con la fluticasona inhalada/nasal — son fármacos distintos en formulación y vía. Suspender al ceder el brote.",
        preparados: [
          { nombre: "Cutivate crema 0,05% (0,5 mg/g)", conc_mg_ml: null },
          { nombre: "Flunutrac crema 0,05%", conc_mg_ml: null },
          { nombre: "Flunutrac pomada 0,005%", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Dermatitis atópica moderada-grave (≥ 1 año)",
        "Eccemas crónicos refractarios a corticoides de baja potencia",
        "Liquen simple crónico",
        "Psoriasis localizada (uso seleccionado)"
      ],
      contraindicaciones: [
        "Infección cutánea activa no tratada (bacteriana, vírica o fúngica)",
        "Rosácea, acné, dermatitis perioral",
        "Hipersensibilidad al fármaco",
        "< 1 año"
      ],
      precauciones: [
        "Atrofia cutánea, telangiectasias, estrías con uso prolongado",
        "Absorción sistémica aumentada en zonas finas, pliegues y bajo oclusión — riesgo de supresión suprarrenal",
        "Limitar duración (≤ 2 semanas seguidas) y superficie aplicada",
        "No aplicar en cara salvo indicación específica corta",
        "En lactantes y niños pequeños vigilar crecimiento y desarrollo con uso prolongado"
      ]
    }
  },

  {
    nombre: "FORMOTEROL + BUDESONIDA",
    categoria: "Respiratorio",
    sinonimos: ["symbicort", "rilast", "duoresp spiromax", "formoterol budesonida"],
    isoColor: ISO.respiratorio,
    icono: "🌬️",
    vias: ["inh"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP) / GEMA",
    intermitente: [
      {
        indicacion: "Asma persistente moderada-grave — Mantenimiento",
        via: "inh",
        dosis_fija_mg: 0,
        intervalo_h: 12,
        nota: "Combinación de **broncodilatador de acción larga (LABA, formoterol)** y **corticoide inhalado (budesonida)**. **Concentraciones pediátricas**: Symbicort Turbuhaler 100/6 (budesonida/formoterol mcg/inh) — uso desde 6 años; 200/6 — uso ≥ 12 años. **Posología estándar**: 1-2 inhalaciones cada 12 h. **Régimen MART (Maintenance And Reliever Therapy)**: la misma combinación se usa como rescate además de mantenimiento ≥ 12 años con 100/6 o 200/6 — máximo 8 inhalaciones/día puntualmente, máx. 12 inhalaciones/día durante < 7 días. NUNCA usar formoterol solo sin corticoide inhalado en asma. Educar en la técnica inhalatoria.",
        preparados: [
          { nombre: "Symbicort Turbuhaler 100/6 mcg (≥ 6 años)", conc_mg_ml: null },
          { nombre: "Symbicort Turbuhaler 200/6 mcg (≥ 12 años)", conc_mg_ml: null },
          { nombre: "Rilast Turbuhaler 100/6 / 200/6 / 320/9 mcg", conc_mg_ml: null },
          { nombre: "DuoResp Spiromax 160/4,5 / 320/9 mcg", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Asma persistente moderada-grave en ≥ 6 años (control insuficiente con CI solos)",
        "Régimen MART (mantenimiento + rescate) en ≥ 12 años",
        "EPOC en adolescentes (uso muy raro en pediatría)"
      ],
      contraindicaciones: [
        "< 6 años (datos pediátricos limitados)",
        "Hipersensibilidad a alguno de los principios activos o lactosa",
        "Asma intermitente (sobre-tratamiento)"
      ],
      precauciones: [
        "Temblor fino, taquicardia, palpitaciones (formoterol)",
        "Candidiasis orofaríngea, disfonía (budesonida) — enjuagar boca tras cada uso",
        "Hipopotasemia con dosis altas",
        "NUNCA usar el LABA en monoterapia (riesgo de muerte por asma severo)",
        "Revisar técnica inhalatoria periódicamente"
      ]
    }
  },

  {
    nombre: "FOSFOMICINA",
    categoria: "Antibiótico",
    sinonimos: ["monurol", "fosfomicina"],
    isoColor: ISO.antibiotico,
    icono: "💊",
    vias: ["oral", "iv"],
    modos: ["intermitente"],
    fuente: "Pediamécum",
    intermitente: [
      {
        indicacion: "Cistitis no complicada (oral)",
        via: "oral",
        dosis_mg_kg_dia: 75,
        intervalo_h: 8,
        dosis_max_dia_mg: 3000,
        duracion: "5-7 días",
        nota: "Fosfomicina cálcica (sales). 1-12 años: 80-100 mg/kg/día c/8 h × 5-7 días. Adolescentes y adultos: cistitis no complicada con fosfomicina trometamol 3 g dosis única. Empirismo en cistitis: revisar resistencias locales.",
        preparados: [
          { nombre: "Fosfocina cápsulas 250 / 500 mg (fosfomicina cálcica)", conc_mg_ml: null },
          { nombre: "Fosfocina susp. 250 mg/5 ml (50 mg/ml)", conc_mg_ml: 50 },
          { nombre: "Monurol sobres 2 g / 3 g (fosfomicina trometamol, dosis única)", conc_mg_ml: null }
        ]
      },
      {
        indicacion: "Infección grave por gramnegativos MR (IV)",
        via: "iv",
        dosis_mg_kg: 50,
        intervalo_h: 8,
        nota: "100-300 mg/kg/día divididos cada 6-8 h en infusión de 1 h. Reservar para infecciones graves por gramnegativos multirresistentes en combinación. Carga importante de Na (vigilar)."
      }
    ],
    info: {
      indicaciones: [
        "Cistitis no complicada (oral, dosis única en adolescentes)",
        "Profilaxis de ITU recurrente",
        "Infecciones graves por gramnegativos multirresistentes (IV, combinación)"
      ],
      contraindicaciones: [
        "Hipersensibilidad a fosfomicina",
        "Insuficiencia renal grave (cálcico)"
      ],
      precauciones: [
        "Carga elevada de sodio (sobre todo IV) — precaución en cardiópatas, HTA, IRC",
        "Diarrea como efecto adverso más frecuente",
        "Hipopotasemia con dosis altas IV",
        "Resistencias por monoterapia: no usar como único agente en infecciones graves"
      ]
    }
  },

  // ── G ─────────────────────────────────────────────────────
  {
    nombre: "GENTAMICINA",
    categoria: "Antibiótico",
    sinonimos: ["gentamicina"],
    isoColor: ISO.antibiotico,
    icono: "💉",
    vias: ["iv", "im"],
    modos: ["intermitente"],
    fuente: "Pediamécum / Neofax",
    intermitente: [
      {
        indicacion: "Infección grave (lactantes y niños)",
        via: "iv",
        dosis_mg_kg: 7,
        intervalo_h: 24,
        nota: "Dosis única diaria 5-7,5 mg/kg/día IV en 30 min. Alternativa: 2,5 mg/kg c/8 h. Monitorización: niveles valle < 1-2 mg/L; pico 6-10 mg/L (dosis única) o 5-8 (multidosis). Asociar a betalactámico en sepsis neonatal o ITU febril."
      },
      {
        indicacion: "Sepsis neonatal — pauta por edad gestacional",
        via: "iv",
        dosis_mg_kg: 4,
        intervalo_h: 24,
        nota: "Pauta según EG y edad postnatal (Neofax): EG ≤ 29 sem: 5 mg/kg c/48 h (< 8 días) o c/24 h (≥ 8 días). EG 30-33 sem: 4,5 mg/kg c/36 h. EG ≥ 34 sem y término: 4 mg/kg c/24 h. Monitorizar niveles antes de la 2.ª o 3.ª dosis."
      }
    ],
    info: {
      indicaciones: [
        "Sepsis neonatal (en combinación con ampicilina)",
        "Pielonefritis aguda",
        "Sepsis grave por gramnegativos (combinación)",
        "Endocarditis (combinación con betalactámico)"
      ],
      contraindicaciones: [
        "Hipersensibilidad a aminoglucósidos",
        "Miastenia gravis"
      ],
      precauciones: [
        "Nefrotoxicidad (vigilar función renal)",
        "Ototoxicidad (coclear y vestibular) — irreversible: evitar usos prolongados",
        "Monitorizar niveles si tratamiento > 48-72 h o IRC",
        "Bloqueo neuromuscular: precaución con relajantes"
      ]
    }
  },

  {
    nombre: "GLUCAGÓN",
    categoria: "Endocrino",
    sinonimos: ["glucagon", "glucagen"],
    isoColor: ISO.endocrino,
    icono: "🍬",
    vias: ["im", "sc", "iv"],
    modos: ["puntual"],
    fuente: "Pediamécum / SEUP",
    puntual: {
      descripcion: "Hipoglucemia grave / Intoxicación por betabloqueantes",
      dosis_mg_kg: 0.03,
      dosis_max_mg: 1,
      via: "IM, SC o IV",
      nota: "Hipoglucemia: < 25 kg o < 6-8 años → 0,5 mg IM/SC; ≥ 25 kg → 1 mg IM/SC. Alternativa: 0,03 mg/kg (máx. 1 mg). Útil si no acceso vascular. Inicio del efecto 5-10 min. Si no responde en 10-15 min repetir o conseguir vía. Intoxicación por betabloqueantes/Ca-antagonistas: bolo 50-150 mcg/kg, después perfusión 50-100 mcg/kg/h."
    },
    info: {
      indicaciones: [
        "Hipoglucemia grave en diabético sin acceso vascular",
        "Intoxicación por betabloqueantes o calcio-antagonistas",
        "Cuerpos extraños esofágicos (uso off-label como relajante)"
      ],
      contraindicaciones: [
        "Insulinoma, feocromocitoma",
        "Hipersensibilidad"
      ],
      precauciones: [
        "Vómitos en > 25% — colocar al paciente en posición de seguridad",
        "Efecto transitorio: administrar carbohidratos al recuperar conciencia",
        "Ineficaz si depleción de glucógeno (ayuno prolongado, neonato, hepatopatía)",
        "Hiperglucemia transitoria tras administración"
      ]
    }
  },

  {
    nombre: "GLUCONATO CÁLCICO 10%",
    categoria: "Reanimación / UCIP",
    sinonimos: ["gluconato calcico", "calcio gluconato"],
    isoColor: ISO.rea,
    icono: "⚡",
    vias: ["iv", "io"],
    modos: ["puntual"],
    fuente: "SEUP / Pediamécum",
    puntual: {
      descripcion: "Hipocalcemia neonatal / pediátrica (preparación específica)",
      dosis_mg_kg: 100,
      dosis_max_mg: 2000,
      via: "IV lenta (en 10-30 min) por vía central o periférica grande",
      nota: "Gluconato cálcico 10%: 100 mg/kg (1 ml/kg) lento. Máx. 20 ml/dosis. Aporta 9,3 mg de calcio elemental por ml. Hipocalcemia neonatal: 1-2 ml/kg/dosis. Preferido sobre cloruro cálcico en vía periférica (menos irritante). Ver entrada combinada CLORURO CÁLCICO / GLUCONATO CÁLCICO para comparativa de presentaciones."
    },
    info: {
      indicaciones: [
        "Hipocalcemia sintomática del neonato y lactante (primera elección por vía periférica)",
        "Hiperpotasemia con cambios ECG",
        "Tetania por hipocalcemia"
      ],
      contraindicaciones: [
        "Hipercalcemia",
        "Toxicidad digitálica"
      ],
      precauciones: [
        "Extravasación: necrosis (menos grave que con cloruro)",
        "Bradicardia con infusión rápida",
        "No mezclar con bicarbonato o fosfato (precipita)",
        "Lavar la vía con SSF antes y después si se administra junto a otros fármacos"
      ]
    }
  },

  {
    nombre: "GLUCOSA HIPERTÓNICA",
    categoria: "Reanimación / UCIP",
    sinonimos: ["glucosa 10%", "glucosa 25%", "glucosa 50%", "dextrosa", "suero glucosado"],
    isoColor: ISO.endocrino,
    icono: "🍬",
    vias: ["iv", "io"],
    modos: ["puntual"],
    fuente: "SEUP / Neofax",
    puntual: {
      descripcion: "Hipoglucemia con acceso vascular",
      dosis_mg_kg: 200,
      via: "IV/IO en bolo lento (2-3 min)",
      nota: "Dosis: 0,2 g/kg de glucosa (200 mg/kg). Equivalencias: 2 ml/kg de glucosado 10% (neonatos), 1 ml/kg glucosado 20%, 4 ml/kg glucosado 5%. En lactantes y niños fuera del periodo neonatal: 0,5 g/kg (5 ml/kg G10% o 2 ml/kg G25%). Tras el bolo, iniciar perfusión de mantenimiento G10% a aportes basales para mantener glucemia."
    },
    info: {
      indicaciones: [
        "Hipoglucemia sintomática o glucemia < 45-50 mg/dl",
        "Hipoglucemia neonatal refractaria",
        "Coma de causa desconocida (administración empírica si no se puede medir glucemia)"
      ],
      contraindicaciones: [
        "Hiperglucemia previa"
      ],
      precauciones: [
        "Hiperglucemia rebote post-bolo: continuar con perfusión",
        "Hiperglucemia mantenida en sepsis: evitar bolos repetidos sin medir glucemia",
        "Soluciones > 10% (12,5% o más): vía central preferente (riesgo de flebitis severa)",
        "En neonatos: NUNCA bolo de G25% o más; usar G10% en bolo y G12,5% por vía periférica como máximo"
      ]
    }
  },

  // ── H ─────────────────────────────────────────────────────
  {
    nombre: "HEPARINA SÓDICA",
    categoria: "Hematología",
    sinonimos: ["heparina", "heparina sodica"],
    isoColor: ISO.neutral,
    icono: "💉",
    vias: ["iv", "sc"],
    modos: ["carga_mantenimiento"],
    fuente: "Pediamécum / UCIP",
    carga: {
      descripcion: "Anticoagulación terapéutica (TVP, TEP, trombosis aguda)",
      dosis_mcg_kg: 75,
      tiempo_min: 10,
      via: "IV en 10 min",
      nota: "Dosis carga 75 UI/kg en 10 min. Mantenimiento: < 1 año 28 UI/kg/h, > 1 año 20 UI/kg/h (ajustar según TTPa o anti-Xa cada 4-6 h). Objetivo TTPa 60-85 s o anti-Xa 0,35-0,7 UI/ml. Antídoto: sulfato de protamina (1 mg neutraliza ~100 UI heparina si < 30 min)."
    },
    presentaciones: [
      {
        label: "20000 UI / 100 ml SSF (UCIP)",
        dosis_mg: 20000, dilucion_ml: 100, suero: "SSF",
        concMgMl: 20000 / 100,                  // 200 UI/ml (UI tratadas como mg)
        dosisRange: "10 – 28 UI/kg/h",
        dosisMin: 10, softMax: 28, hardMax: 40,
        unidad: "UI/kg/h", calcTipo: "mg_kg_h"
      }
    ],
    info: {
      indicaciones: [
        "Trombosis venosa profunda y tromboembolismo pulmonar agudos",
        "Trombosis arterial aguda",
        "Anticoagulación en circulación extracorpórea (cirugía cardíaca, ECMO, diálisis)",
        "Profilaxis de trombosis de catéter central"
      ],
      contraindicaciones: [
        "Hemorragia activa significativa",
        "Trombocitopenia inducida por heparina (HIT) previa",
        "Coagulopatía no corregida",
        "Cirugía reciente del SNC u oftalmológica"
      ],
      precauciones: [
        "Monitorización estrecha de TTPa o anti-Xa",
        "Trombocitopenia (vigilar plaquetas, descartar HIT si caída > 50%)",
        "Antídoto: sulfato de protamina",
        "Osteoporosis con uso prolongado (> 1 mes)"
      ]
    }
  },

  {
    nombre: "HIDRALAZINA",
    categoria: "Cardiología",
    sinonimos: ["hidralazina", "hydrapres"],
    isoColor: ISO.cardio,
    icono: "💉",
    vias: ["iv", "oral", "im"],
    modos: ["intermitente"],
    fuente: "Pediamécum",
    intermitente: [
      {
        indicacion: "Crisis hipertensiva (IV)",
        via: "iv",
        dosis_mg_kg: 0.2,
        intervalo_h: 4,
        dosis_max_mg: 20,
        nota: "0,1-0,2 mg/kg/dosis (máx. 20 mg) IV en bolo lento o IM. Inicio del efecto 10-30 min, duración 4-12 h. Repetir cada 4-6 h. Útil en preeclampsia/eclampsia. Alternativa: perfusión continua 0,75-5 mcg/kg/min."
      },
      {
        indicacion: "HTA crónica (oral)",
        via: "oral",
        dosis_mg_kg_dia: 0.75,
        intervalo_h: 6,
        dosis_max_dia_mg: 200,
        nota: "Iniciar 0,75 mg/kg/día divididos cada 6-12 h; titular hasta máx. 7,5 mg/kg/día (máx. 200 mg/día). Indicada en HTA refractaria, especialmente vasodilatador en insuficiencia cardíaca.",
        preparados: [
          { nombre: "Hidralazina comp. 25 / 50 mg", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Crisis hipertensiva (especialmente con sospecha de etiología renal)",
        "Hipertensión gestacional / preeclampsia",
        "Insuficiencia cardíaca (asociada a nitratos como vasodilatador)",
        "HTA refractaria a tratamiento de primera línea"
      ],
      contraindicaciones: [
        "Taquicardia significativa",
        "Cardiopatía isquémica",
        "Lupus eritematoso sistémico (induce síndrome lupus-like)",
        "Estenosis mitral, cor pulmonale grave"
      ],
      precauciones: [
        "Taquicardia refleja — asociar betabloqueante en HTA crónica",
        "Síndrome lupus-like con uso prolongado (vigilar ANA)",
        "Cefalea, rubor, palpitaciones frecuentes",
        "Inicio de acción lento IV (10-30 min) — no esperar respuesta inmediata"
      ]
    }
  },

  {
    nombre: "HIDROCLOROTIAZIDA",
    categoria: "Diurético",
    sinonimos: ["hidroclorotiazida", "esidrex"],
    isoColor: ISO.cardio,
    icono: "💧",
    vias: ["oral"],
    modos: ["intermitente"],
    fuente: "Pediamécum",
    intermitente: [
      {
        indicacion: "HTA / Edema / Displasia broncopulmonar (con espironolactona)",
        via: "oral",
        dosis_mg_kg_dia: 2,
        intervalo_h: 12,
        dosis_max_dia_mg: 50,
        nota: "1-3 mg/kg/día divididos en 1-2 tomas (máx. 50 mg/día en niños, 100 mg/día adolescentes). Lactantes < 6 meses pueden requerir hasta 3 mg/kg/día. Eficacia limitada en FG < 30 ml/min. Asociar a espironolactona en DBP para limitar pérdida de K+.",
        preparados: [
          { nombre: "Esidrex comp. 25 / 50 mg", conc_mg_ml: null },
          { nombre: "Hidroclorotiazida fórmula magistral susp. 5 mg/ml", conc_mg_ml: 5 }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Hipertensión arterial pediátrica (diurético de inicio en algunos protocolos)",
        "Edema/sobrecarga de volumen leve-moderada",
        "Displasia broncopulmonar (con espironolactona)",
        "Hipercalciuria idiopática (reduce calciuria)",
        "Diabetes insípida nefrogénica (paradójicamente reduce poliuria)"
      ],
      contraindicaciones: [
        "Anuria",
        "Insuficiencia renal grave (FG < 30 ml/min — eficacia muy reducida)",
        "Hipersensibilidad a sulfamidas",
        "Hipopotasemia o hiponatremia grave no corregidas"
      ],
      precauciones: [
        "Hipopotasemia, hiponatremia, hipomagnesemia, hipercalcemia, hiperuricemia",
        "Hiperglucemia, dislipidemia",
        "Fotosensibilidad",
        "Sin efecto natriurético si FG muy bajo"
      ]
    }
  },

  {
    nombre: "HIDROCORTISONA",
    categoria: "Corticoide",
    sinonimos: ["actocortina", "hidrocortisona"],
    isoColor: ISO.endocrino,
    icono: "💉",
    vias: ["iv", "im"],
    modos: ["puntual", "intermitente"],
    fuente: "Pediamécum / SEUP",
    puntual: {
      descripcion: "Anafilaxia / Estado asmático grave / Insuficiencia suprarrenal aguda",
      dosis_mg_kg: 4,
      dosis_max_mg: 200,
      via: "IV/IM. Anafilaxia (tras adrenalina): 4-8 mg/kg (máx. 200 mg). Asma grave: 2-4 mg/kg cada 6 h (máx. 100-125 mg/dosis). Crisis adrenal: 1-2 mg/kg en bolo (50-100 mg/m²).",
      nota: "Dosis por defecto calculada para anafilaxia/asma grave (4 mg/kg, máx. 200 mg). Inicio acción 1-2 h. En crisis adrenal: 1-2 mg/kg en bolo, después perfusión a 25-50 mg/m²/día. Dosis fijas alternativas por edad: lactante 25 mg, escolar 50 mg, adolescente 100 mg."
    },
    intermitente: [
      {
        indicacion: "Insuficiencia suprarrenal — mantenimiento",
        via: "iv",
        dosis_mg_kg: 2,
        intervalo_h: 6,
        dosis_max_mg: 100,
        nota: "8-10 mg/m²/día en sustitución crónica. Dosis de estrés: triplicar dosis basal."
      }
    ],
    info: {
      indicaciones: [
        "Insuficiencia suprarrenal aguda (primera elección)",
        "Estado asmático grave (alternativa a metilprednisolona)",
        "Anafilaxia (coadyuvante tras adrenalina)",
        "Shock refractario en sepsis (a debate)"
      ],
      contraindicaciones: [
        "Hipersensibilidad",
        "Infección sistémica sin tratamiento (excepto situación vital)"
      ],
      precauciones: [
        "Hiperglucemia, HTA",
        "Hipocalemia con dosis altas",
        "No retirar bruscamente tras > 7 días"
      ]
    }
  },

  {
    nombre: "HIDROCORTISONA TÓPICA",
    categoria: "Dermatología",
    sinonimos: ["lactisona", "hidrocortisona crema", "hidrocortisona topica"],
    isoColor: ISO.respiratorio,
    icono: "🧴",
    vias: ["top"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Dermatitis atópica / eccema leve",
        via: "top",
        dosis_fija_mg: 0,
        intervalo_h: 12,
        duracion: "5-7 días en cara y pliegues; 7-14 días en otras zonas",
        nota: "Corticoide tópico de baja potencia. Aplicar capa fina 1-2 veces al día sobre la lesión. Crema al 0,5% o 1%. Concentración al 1% se usa en zonas resistentes (placa, espalda); 0,5% en cara, pliegues y lactantes. Evitar oclusión prolongada y zonas perioculares. Suspender al ceder el brote.",
        preparados: [
          { nombre: "Lactisona 1% loción", conc_mg_ml: null },
          { nombre: "Lactisona 0,5% loción", conc_mg_ml: null },
          { nombre: "Hidrocortisona crema 1% (varios genéricos)", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Dermatitis atópica leve-moderada (especialmente brotes)",
        "Dermatitis seborreica del lactante",
        "Eccema de contacto leve",
        "Prurito localizado"
      ],
      contraindicaciones: [
        "Infección cutánea no tratada (bacteriana, vírica, fúngica)",
        "Rosácea, acné, dermatitis perioral",
        "Hipersensibilidad al fármaco o excipientes"
      ],
      precauciones: [
        "Atrofia cutánea, telangiectasias e hipopigmentación con uso prolongado",
        "Absorción sistémica aumentada en piel fina (cara, pliegues, genitales) y bajo oclusión",
        "Lactantes: superficie corporal/peso elevada — riesgo de supresión suprarrenal con uso extenso prolongado",
        "Limitar a 1-2 semanas por brote, no usar como mantenimiento"
      ]
    }
  },

  {
    nombre: "HIDROXIZINA",
    categoria: "Antihistamínico",
    sinonimos: ["atarax", "hidroxizina"],
    isoColor: ISO.respiratorio,
    icono: "🤧",
    vias: ["oral", "im"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Prurito / urticaria / sedación previa",
        via: "oral",
        dosis_mg_kg_dia: 1,
        intervalo_h: 8,
        dosis_max_dia_mg: 50,
        nota: "Antihistamínico H1 de 1.ª generación con efecto sedante. 1-2 mg/kg/día divididos cada 6-8 h. Edad mínima > 12 meses (preferible > 2 años por riesgo de QT). Máx. 2 mg/kg/día. Dosis máx. diaria: 50 mg en niños < 40 kg; 100 mg en > 40 kg / adolescente. AEMPS limitó dosis máximas en 2015 por riesgo de prolongación QT. NO usar en niños con riesgo cardiovascular o que tomen otros fármacos QT-prolongadores.",
        preparados: [
          { nombre: "Atarax jarabe 10 mg/5 ml (2 mg/ml)", conc_mg_ml: 2 },
          { nombre: "Atarax comprimidos 25 mg", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Prurito agudo o crónico (urticaria, dermatitis atópica)",
        "Sedación pre-procedimientos (uso ocasional)",
        "Ansiedad y agitación leve (uso muy limitado en pediatría)"
      ],
      contraindicaciones: [
        "QTc prolongado o riesgo de prolongación",
        "Uso concomitante con QT-prolongadores potentes",
        "Hipopotasemia o hipomagnesemia no corregidas",
        "Bradicardia significativa",
        "Hipersensibilidad a hidroxizina, cetirizina o piperazinas",
        "Lactantes < 12 meses"
      ],
      precauciones: [
        "Prolongación de QTc dosis-dependiente — riesgo de Torsade de pointes",
        "Sedación marcada — precaución en escolares (rendimiento escolar)",
        "Anticolinérgico: sequedad de boca, retención urinaria, midriasis",
        "No combinar con depresores SNC sin valorar riesgo",
        "Excitación paradójica en lactantes"
      ]
    }
  },

  {
    nombre: "HIERRO ORAL",
    categoria: "Hematología",
    sinonimos: ["hierro", "ferroglicina", "sulfato ferroso", "ferro-sanol", "ferplex"],
    isoColor: ISO.neutral,
    icono: "💊",
    vias: ["oral"],
    modos: ["intermitente"],
    fuente: "Pediamécum / AEP",
    intermitente: [
      {
        indicacion: "Tratamiento de anemia ferropénica",
        via: "oral",
        dosis_mg_kg: 3,
        intervalo_h: 24,
        dosis_max_mg: 200,
        duracion: "3-6 meses (continuar 2-3 m tras normalización Hb)",
        nota: "Dosis expresada en hierro elemental: 3-6 mg/kg/día en 1-3 tomas. Administrar con el estómago vacío y con vitamina C (zumo cítrico) para mejorar absorción. Evitar leche y derivados en la toma. Heces oscuras esperadas. La pauta de 1 dosis/día en ayunas es tan eficaz como múltiples dosis y mejor tolerada.",
        preparados: [
          { nombre: "Ferroglicina sulfato susp. 30 mg/ml (Ferro Sanol gotas, hierro elemental)", conc_mg_ml: 30 },
          { nombre: "Ferroprotinato susp. (Ferplex/Profer 40 mg/15 ml hierro elemental)", conc_mg_ml: 2.7 },
          { nombre: "Lactato ferroso solución (Cromatonbic ferro 37,5 mg/5 ml)", conc_mg_ml: 7.5 }
        ]
      },
      {
        indicacion: "Profilaxis en prematuros y lactantes de riesgo",
        via: "oral",
        dosis_mg_kg: 2,
        intervalo_h: 24,
        nota: "Prematuros: 2-4 mg/kg/día desde las 4-8 semanas de vida hasta los 12 meses. Lactantes nacidos a término con LM exclusiva: 1 mg/kg/día desde los 4 meses hasta inicio de alimentación complementaria con hierro.",
        preparados: [
          { nombre: "Ferroglicina sulfato gotas (30 mg/ml hierro elemental)", conc_mg_ml: 30 }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Anemia ferropénica (primera elección)",
        "Profilaxis en prematuros, BPEG, lactancia materna exclusiva > 4-6 meses",
        "Suplementación en adolescentes con menarquia abundante",
        "Depleción ferropénica sin anemia (ferritina baja)"
      ],
      contraindicaciones: [
        "Anemia no ferropénica (hemolítica, sideroblástica, talasemia mayor sin déficit)",
        "Hemocromatosis",
        "Intolerancia previa demostrada",
        "Enfermedad inflamatoria intestinal activa (relativa)"
      ],
      precauciones: [
        "Intolerancia digestiva muy frecuente (epigastralgia, náuseas, estreñimiento o diarrea)",
        "Tinción dental reversible (administrar con jeringa al fondo de la boca y enjuagar)",
        "Sobredosis muy peligrosa (> 60 mg/kg de hierro elemental): mantener fuera del alcance",
        "Interacciones: leche, calcio, antiácidos, antibióticos (tetraciclinas, quinolonas) — espaciar 2 h"
      ]
    }
  },

  // ── I ─────────────────────────────────────────────────────
  {
    nombre: "IBUPROFENO",
    categoria: "Analgesia / Antitérmico",
    sinonimos: ["ibuprofeno", "dalsy", "junifen"],
    isoColor: ISO.analgesia,
    icono: "🌡️",
    vias: ["oral", "iv"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP) / SEUP",
    intermitente: [
      {
        indicacion: "Fiebre / dolor",
        via: "oral",
        dosis_mg_kg: 7,
        intervalo_h: 8,
        dosis_max_mg: 600,
        dosis_max_dia_mg: 2400,
        nota: "5-10 mg/kg/dosis cada 6-8 h. Tomar con alimentos. No usar en < 3 meses ni en deshidratación. Máx. 40 mg/kg/día.",
        preparados: [
          { nombre: "Dalsy 20 mg/ml suspensión", conc_mg_ml: 20 },
          { nombre: "Dalsy 40 mg/ml suspensión", conc_mg_ml: 40 },
          { nombre: "Junifen 20 mg/ml", conc_mg_ml: 20 },
          { nombre: "Junifen 40 mg/ml", conc_mg_ml: 40 }
        ]
      },
      {
        indicacion: "Antiinflamatorio (artritis, artralgia)",
        via: "oral",
        dosis_mg_kg_dia: 30,
        intervalo_h: 8,
        dosis_max_dia_mg: 2400,
        duracion: "Según respuesta",
        nota: "Hasta 30-40 mg/kg/día como antiinflamatorio. Vigilar tolerancia gástrica y función renal en uso prolongado.",
        preparados: [
          { nombre: "Dalsy 40 mg/ml suspensión", conc_mg_ml: 40 }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Fiebre en > 3 meses",
        "Dolor leve-moderado",
        "Antiinflamatorio (artritis idiopática juvenil, dismenorrea)",
        "Cierre de ductus arterioso persistente (uso neonatal específico — Pedea®)"
      ],
      contraindicaciones: [
        "< 3 meses de edad",
        "Hipovolemia / deshidratación significativa",
        "Insuficiencia renal",
        "Úlcera péptica activa, sangrado digestivo",
        "Alergia a AINEs",
        "Varicela (asociación discutida con fascitis necrotizante)"
      ],
      precauciones: [
        "Tomar con alimentos para reducir efectos gastrointestinales",
        "Vigilar función renal en deshidratación",
        "Evitar en sospecha de dengue u otras enfermedades hemorrágicas",
        "Cuidado en niños con asma severa sensible a AINE"
      ]
    }
  },

  {
    nombre: "INDOMETACINA",
    categoria: "Neonatos",
    sinonimos: ["indometacina", "indocid"],
    isoColor: ISO.neonatal,
    icono: "👶",
    vias: ["iv", "oral"],
    modos: ["intermitente"],
    fuente: "Neofax / SEN",
    intermitente: [
      {
        indicacion: "Cierre farmacológico del ductus arterioso persistente (DAP)",
        via: "iv",
        dosis_mg_kg: 0.2,
        intervalo_h: 12,
        nota: "Pauta clásica 3 dosis: 0,2 mg/kg → 0,1 mg/kg a las 12 h → 0,1 mg/kg a las 36 h (intervalos según edad postnatal). En neonatos > 7 días: 0,2 mg/kg cada 12-24 h × 3 dosis. Diluir en SSF e infundir en 30 min. Vigilar diuresis, función renal, plaquetas y signos de sangrado/perforación. Alternativa: ibuprofeno IV (Pedea), de uso preferente en muchas unidades por mejor perfil renal.",
        preparados: []
      },
      {
        indicacion: "Profilaxis de hemorragia intraventricular en prematuros extremos",
        via: "iv",
        dosis_mg_kg: 0.1,
        intervalo_h: 24,
        duracion: "3 días",
        nota: "0,1 mg/kg/día × 3 días iniciado en las primeras 6-12 h de vida en prematuros extremos. Indicación específica con evidencia controvertida; valorar protocolos locales."
      }
    ],
    info: {
      indicaciones: [
        "Cierre farmacológico del ductus arterioso persistente en prematuros",
        "Profilaxis de hemorragia intraventricular grave en prematuros extremos (uso seleccionado)"
      ],
      contraindicaciones: [
        "Insuficiencia renal significativa (creatinina > 1,5 mg/dl, oliguria < 1 ml/kg/h)",
        "Hemorragia activa (digestiva, intracraneal)",
        "Plaquetas < 50.000",
        "Enterocolitis necrotizante (sospechada o confirmada)",
        "Hiperbilirrubinemia severa (desplaza bilirrubina)"
      ],
      precauciones: [
        "Vasoconstricción renal con oliguria — vigilar diuresis estrictamente",
        "Riesgo de hemorragia (digestiva, intracraneal) y perforación intestinal",
        "Disminuye flujo mesentérico y cerebral",
        "Vigilar plaquetas, función renal e hidratación durante el tratamiento"
      ]
    }
  },

  // ── K ─────────────────────────────────────────────────────
  {
    nombre: "KETAMINA",
    categoria: "Analgesia / Sedación",
    sinonimos: ["ketolar", "ketamina"],
    isoColor: ISO.analgesia,
    icono: "💉",
    vias: ["iv", "im", "neb"],
    modos: ["puntual", "perfusion"],
    fuente: "SEUP / Pediamécum",
    puntual: {
      descripcion: "Sedación disociativa para procedimientos",
      dosis_mg_kg: 1,
      dosis_max_mg: 100,
      via: "IV 1-2 mg/kg lento en 1 min. IM 4-5 mg/kg. Intranasal 3-9 mg/kg. Repetir 0,5-1 mg/kg IV si precisa.",
      nota: "Sialorrea: considerar atropina previa (0,01 mg/kg). Mantener vía aérea. Vigilar despertar (fenómenos disociativos). Asociar midazolam si > 10 años para reducirlos."
    },
    presentaciones: [
      {
        label: "500 mg / 100 ml SG5%",
        dosis_mg: 500, dilucion_ml: 100, suero: "Dx5%",
        concMgMl: 500 / 100,                    // 5 mg/ml
        dosisRange: "0,5 – 2 mg/kg/h",
        dosisMin: 0.3, softMax: 2, hardMax: 4,
        unidad: "mg/kg/h", calcTipo: "mg_kg_h"
      }
    ],
    info: {
      indicaciones: [
        "Sedoanalgesia para procedimientos dolorosos cortos",
        "Inducción anestésica (especialmente en shock o asma)",
        "Estado asmático refractario (perfusión)",
        "Sedoanalgesia en UCIP"
      ],
      contraindicaciones: [
        "Hipertensión intracraneal (relativa)",
        "Psicosis activa",
        "Hipertiroidismo no controlado",
        "Lesión globo ocular abierto"
      ],
      precauciones: [
        "Hipersalivación — atropina o glicopirrolato si precisa",
        "Fenómenos disociativos al despertar",
        "Laringoespasmo (raro)",
        "Aumento de PIC e PIO — controversial en TCE leve, generalmente seguro"
      ]
    }
  },

  // ── L ─────────────────────────────────────────────────────
  {
    nombre: "LABETALOL",
    categoria: "Cardiología",
    sinonimos: ["trandate", "labetalol"],
    isoColor: ISO.cardio,
    icono: "💉",
    vias: ["iv", "oral"],
    modos: ["intermitente"],
    fuente: "Pediamécum",
    intermitente: [
      {
        indicacion: "Crisis hipertensiva (IV)",
        via: "iv",
        dosis_mg_kg: 0.25,
        intervalo_h: 4,
        dosis_max_mg: 20,
        nota: "Bolo 0,2-1 mg/kg (máx. 20 mg) en 2-5 min, repetir cada 10-15 min hasta control. Alternativa preferente: perfusión continua 0,4-3 mg/kg/h (titular). Combina bloqueo α y β: efecto vasodilatador con control de taquicardia refleja."
      },
      {
        indicacion: "HTA crónica (oral)",
        via: "oral",
        dosis_mg_kg_dia: 4,
        intervalo_h: 12,
        dosis_max_dia_mg: 1200,
        nota: "Iniciar 1-3 mg/kg/día c/12 h; titular hasta 10-40 mg/kg/día (máx. 1200 mg/día). Especialmente útil en HTA gestacional, feocromocitoma (con bloqueo α previo).",
        preparados: [
          { nombre: "Trandate comp. 100 / 200 mg", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Crisis hipertensiva en niños y adolescentes",
        "HTA gestacional / preeclampsia",
        "HTA crónica resistente",
        "Feocromocitoma (tras bloqueo α)"
      ],
      contraindicaciones: [
        "Asma grave activo, bradicardia significativa",
        "Bloqueo AV 2.º-3.er grado",
        "Insuficiencia cardíaca descompensada",
        "Shock cardiogénico"
      ],
      precauciones: [
        "Broncoespasmo (efecto β2 aunque menor que betabloqueantes no selectivos)",
        "Bradicardia, bloqueo AV: monitorizar ECG",
        "Hipotensión ortostática",
        "Hipoglucemia (puede enmascarar síntomas adrenérgicos)"
      ]
    }
  },

  {
    nombre: "LACTOBACILLUS REUTERI",
    categoria: "Digestivo",
    sinonimos: ["biogaia", "reuterin", "lactobacillus reuteri", "probiotico reuteri"],
    isoColor: ISO.digestivo,
    icono: "💧",
    vias: ["oral"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP) / ESPGHAN",
    intermitente: [
      {
        indicacion: "Cólico del lactante",
        via: "oral",
        dosis_fija_mg: 0,
        intervalo_h: 24,
        duracion: "21-28 días",
        nota: "Probiótico (Lactobacillus reuteri DSM 17938). **Posología**: 5 gotas (= 10⁸ UFC) una vez al día durante 21-28 días. Administrar antes de la toma. Algunos estudios y guías ESPGHAN sugieren beneficio en cólico del lactante alimentado al pecho. Beneficio inferior y menos consistente en lactantes alimentados con fórmula. Sin restricción de edad: utilizable desde el periodo neonatal. Considerar en familias con cólicos refractarios a medidas conservadoras (masaje, contención, lactancia a demanda).",
        preparados: [
          { nombre: "BioGaia ProTectis gotas (10⁸ UFC en 5 gotas)", conc_mg_ml: null },
          { nombre: "BioGaia ProTectis comprimidos masticables 10⁸ UFC", conc_mg_ml: null },
          { nombre: "Reuterin gotas y comp. masticables", conc_mg_ml: null }
        ]
      },
      {
        indicacion: "Diarrea aguda infecciosa (coadyuvante)",
        via: "oral",
        dosis_fija_mg: 0,
        intervalo_h: 12,
        duracion: "5-7 días",
        nota: "5 gotas (10⁸ UFC) cada 12 h durante 5-7 días, junto con rehidratación oral. Reduce la duración de la diarrea aguda en 1 día aproximadamente (evidencia moderada). Recomendado por ESPGHAN como coadyuvante en diarrea aguda en > 1 mes, junto con S. boulardii y L. rhamnosus GG."
      },
      {
        indicacion: "Reflujo gastroesofágico funcional / Regurgitación del lactante",
        via: "oral",
        dosis_fija_mg: 0,
        intervalo_h: 24,
        duracion: "4 semanas",
        nota: "5 gotas/día durante 4 semanas. Reduce regurgitación funcional en algunos lactantes, sin sustituir las medidas posturales y dietéticas. Beneficio variable; suspender si no hay respuesta a las 4 semanas."
      }
    ],
    info: {
      indicaciones: [
        "Cólico del lactante (especialmente con lactancia materna)",
        "Diarrea aguda infecciosa (coadyuvante a la rehidratación)",
        "Prevención de diarrea asociada a antibióticos",
        "Reflujo gastroesofágico funcional / regurgitación",
        "Prevención de enterocolitis necrotizante en prematuros (uso en UCIN protocolizado)"
      ],
      contraindicaciones: [
        "Inmunodepresión grave (riesgo teórico de bacteriemia)",
        "Catéter venoso central (riesgo teórico de translocación)",
        "Pancreatitis aguda grave",
        "Síndrome de intestino corto con permeabilidad alterada"
      ],
      precauciones: [
        "Excelente perfil de seguridad en lactantes sanos",
        "Conservar refrigerado (algunas presentaciones); agitar antes del uso",
        "Distinguir del cólico patológico: revaluar si rechazo de tomas, fallo de medro, sangre en heces o vómitos"
      ]
    }
  },

  {
    nombre: "LACTULOSA",
    categoria: "Digestivo",
    sinonimos: ["duphalac", "lactulosa"],
    isoColor: ISO.digestivo,
    icono: "💩",
    vias: ["oral", "rectal"],
    modos: ["intermitente"],
    fuente: "Pediamécum",
    intermitente: [
      {
        indicacion: "Estreñimiento (mantenimiento)",
        via: "oral",
        dosis_mg_kg: 333,
        intervalo_h: 12,
        nota: "Lactantes: 2,5-5 ml/día (1-3 g/día). 1-6 años: 5-10 ml/día (3,3-6,7 g/día). > 6 años: 10-15 ml/día (6,7-10 g/día). Ajustar dosis según respuesta hasta 1-2 deposiciones blandas/día. Inicio del efecto 24-48 h.",
        preparados: [
          { nombre: "Duphalac jarabe 666,7 mg/ml (10 g/15 ml)", conc_mg_ml: 666.7 },
          { nombre: "Duphalac sobres 10 g (15 ml)", conc_mg_ml: null }
        ]
      },
      {
        indicacion: "Encefalopatía hepática",
        via: "oral",
        dosis_mg_kg_dia: 2000,
        intervalo_h: 6,
        nota: "Objetivo: 2-3 deposiciones blandas al día. Lactantes 2,5-10 ml/día divididos cada 6-8 h. Niños mayores: 40-90 ml/día divididos."
      }
    ],
    info: {
      indicaciones: [
        "Estreñimiento crónico funcional (primera elección en pediatría)",
        "Encefalopatía hepática (reduce amonio)",
        "Disquecia del lactante"
      ],
      contraindicaciones: [
        "Galactosemia",
        "Obstrucción intestinal",
        "Intolerancia a galactosa/fructosa"
      ],
      precauciones: [
        "Distensión abdominal y flatulencia (efectos frecuentes, suelen ceder)",
        "Diarrea por sobredosificación: reducir dosis",
        "Contiene azúcares (precaución en diabéticos)",
        "Efecto lento (24-48 h): no útil en estreñimiento agudo refractario"
      ]
    }
  },

  {
    nombre: "LÁGRIMAS ARTIFICIALES / LUBRICANTES OCULARES",
    categoria: "Oftalmología",
    sinonimos: ["lagrimas artificiales", "hyabak", "systane", "optava", "lipoflavonoid", "lagrimas", "hialuronato sodico colirio", "carbomero colirio"],
    isoColor: ISO.respiratorio,
    icono: "👁️",
    vias: ["oft"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Ojo seco / Irritación ocular / Lubricación",
        via: "oft",
        dosis_fija_mg: 0,
        intervalo_h: 4,
        duracion: "Según síntomas (crónica si ojo seco)",
        nota: "Soluciones lubricantes basadas en hialuronato sódico (0,15-0,4%), carbómero (0,2%), hipromelosa o polietilenglicol. **Posología orientativa**: 1 gota en cada ojo afecto cada 4-8 h (o más frecuente en irritaciones agudas, cada 1-2 h). Sin restricción de edad: utilizable desde lactantes. **Preferir presentaciones SIN conservantes (monodosis)** en lactantes, niños pequeños y en uso > 4 veces/día. Indicaciones: ojo seco por baja humedad, exposición a pantallas, lentes de contacto, irritación tras retirar cuerpo extraño, conjuntivitis vírica como sintomático, etc. NO contienen principio activo farmacológico — son protectores y lubricantes.",
        preparados: [
          { nombre: "Hyabak colirio 0,15% (hialuronato), multidosis sin conservantes", conc_mg_ml: null },
          { nombre: "Systane Ultra (polietilenglicol + propilenglicol)", conc_mg_ml: null },
          { nombre: "Optava Fusión monodosis (hialuronato)", conc_mg_ml: null },
          { nombre: "Lipolac gel oftálmico (carbómero) — uso nocturno", conc_mg_ml: null },
          { nombre: "Viscofresh 0,5% / 1% (carmelosa) monodosis", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Síndrome de ojo seco (incluso en niños con pantallas o aires acondicionados)",
        "Irritación ocular leve (humo, polvo, viento, sol)",
        "Coadyuvante en conjuntivitis vírica y alérgica (alivio sintomático)",
        "Tras retirar cuerpo extraño corneal",
        "Lubricación nocturna (formulaciones en gel)"
      ],
      contraindicaciones: [
        "Hipersensibilidad a alguno de los excipientes (raro)"
      ],
      precauciones: [
        "Preferir presentaciones sin conservantes en uso prolongado o frecuente",
        "Conservar el envase abierto según ficha técnica (habitual < 4 semanas)",
        "Retirar lentes de contacto antes de instilar la mayoría de formulaciones",
        "Si persiste el ojo seco crónico en un niño: descartar causas (deficiencia vitamina A, síndrome Sjögren, blefaritis, anomalías palpebrales)"
      ]
    }
  },

  {
    nombre: "LEVETIRACETAM",
    categoria: "Antiepiléptico / Sedante",
    sinonimos: ["keppra", "levetiracetam"],
    isoColor: ISO.neuro,
    icono: "🧠",
    vias: ["iv", "oral"],
    modos: ["carga_mantenimiento", "intermitente"],
    fuente: "SEUP / Pediamécum",
    carga: {
      descripcion: "Estatus epiléptico refractario a benzodiacepinas",
      dosis_mg_kg: 60,
      tiempo_min: 15,
      via: "IV en 15 min, diluido en SSF o SG5%",
      nota: "Dosis de carga 40-60 mg/kg (máx. 4500 mg). Alternativa a fenitoína en estatus. Excelente perfil de seguridad: sin efectos cardiovasculares ni respiratorios significativos."
    },
    presentaciones: [
      {
        label: "Mantenimiento — 100 mg/ml",
        dosis_mg: 100, dilucion_ml: 1, suero: "Puro o SSF",
        concMgMl: 100,
        dosisRange: "20 – 60 mg/kg/día",
        dosisMin: 10, softMax: 60, hardMax: 100,
        unidad: "mg/kg/día", calcTipo: "mg_kg_h"  // referencial; el cálculo principal es como intermitente
      }
    ],
    intermitente: [
      {
        indicacion: "Mantenimiento antiepiléptico",
        via: "oral",
        dosis_mg_kg_dia: 40,
        intervalo_h: 12,
        dosis_max_dia_mg: 3000,
        nota: "Iniciar 20 mg/kg/día y titular hasta 40-60 mg/kg/día según respuesta. Eficacia en epilepsias focales y generalizadas.",
        preparados: [
          { nombre: "Keppra 100 mg/ml solución oral", conc_mg_ml: 100 }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Estatus epiléptico (segunda línea tras benzodiacepinas)",
        "Mantenimiento de epilepsias focales y generalizadas",
        "Profilaxis de crisis postraumáticas"
      ],
      contraindicaciones: [
        "Hipersensibilidad al levetiracetam"
      ],
      precauciones: [
        "Cambios conductuales: irritabilidad, agresividad (10-15%)",
        "Somnolencia",
        "Ajustar en insuficiencia renal",
        "No requiere monitorización de niveles habitualmente"
      ]
    }
  },

  {
    nombre: "LEVOCETIRIZINA",
    categoria: "Antihistamínico",
    sinonimos: ["xazal", "levocetirizina"],
    isoColor: ISO.respiratorio,
    icono: "🤧",
    vias: ["oral"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Rinitis alérgica / urticaria — pauta por edad",
        via: "oral",
        dosis_fija_mg: 2.5,
        intervalo_h: 24,
        nota: "Enantiómero activo de cetirizina. Antihistamínico H1 de 2.ª generación. Pauta por edad: 6 meses-1 año → 1,25 mg/día (2,5 ml); 1-6 años → 1,25 mg c/12 h (= 2,5 mg/día); 6-12 años → 5 mg/día; ≥ 12 años → 5 mg/día. Inicio efecto en 1 h, duración 24 h. Menos sedante que cetirizina racémica a igual dosis.",
        preparados: [
          { nombre: "Xazal solución oral 0,5 mg/ml (2,5 mg/5 ml)", conc_mg_ml: 0.5 },
          { nombre: "Xazal comprimidos 5 mg", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Rinitis alérgica estacional y perenne",
        "Urticaria crónica idiopática",
        "Coadyuvante en conjuntivitis alérgica"
      ],
      contraindicaciones: [
        "Hipersensibilidad a levocetirizina, cetirizina, hidroxizina o piperazinas",
        "Insuficiencia renal grave (FG < 10 ml/min)"
      ],
      precauciones: [
        "Sedación leve (menos que cetirizina, mucho menos que hidroxizina)",
        "Sequedad de boca, cefalea",
        "Ajustar dosis en insuficiencia renal moderada",
        "Sin efecto significativo sobre QTc a dosis recomendadas"
      ]
    }
  },

  // ── M ─────────────────────────────────────────────────────
  {
    nombre: "LEVOSIMENDÁN",
    categoria: "Reanimación / UCIP",
    sinonimos: ["simdax", "levosimendan"],
    isoColor: ISO.cardio,
    icono: "🫀",
    vias: ["iv"],
    modos: ["carga_mantenimiento"],
    fuente: "Pediamécum (AEP) / UCIP",
    carga: {
      descripcion: "Disfunción ventricular grave / bajo gasto refractario",
      dosis_mcg_kg: 6,
      tiempo_min: 10,
      via: "IV en 10 min, diluido en SG5%",
      nota: "Carga opcional: **6-12 mcg/kg en 10 min** (a menudo omitida en pediatría por hipotensión). **Mantenimiento: 0,1-0,2 mcg/kg/min durante 24 h** (única infusión, sin necesidad de prolongar). Sensibilizador del calcio en miofibrillas y vasodilatador (apertura de canales K-ATP). Inotropo NO catecolaminérgico — útil cuando hay tolerancia o resistencia a catecolaminas. Efecto sostenido 7-10 días gracias al metabolito activo. Indicado en disfunción ventricular grave, bajo gasto refractario postcirugía cardíaca y descompensación aguda de insuficiencia cardíaca crónica. Iniciar tras estabilización hemodinámica."
    },
    presentaciones: [
      {
        label: "12,5 mg / 50 ml SG5% (UCIP)",
        dosis_mg: 12.5, dilucion_ml: 50, suero: "Dx5%",
        concUgMl: (12.5 * 1000) / 50,         // 250 mcg/ml
        dosisRange: "0,05 – 0,2 mcg/kg/min",
        dosisMin: 0.05, softMax: 0.2, hardMax: 0.3,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      }
    ],
    info: {
      indicaciones: [
        "Disfunción ventricular grave postcirugía cardíaca pediátrica",
        "Bajo gasto refractario a catecolaminas",
        "Descompensación aguda de insuficiencia cardíaca crónica",
        "Miocarditis fulminante (uso seleccionado, con o sin ECMO)"
      ],
      contraindicaciones: [
        "Hipotensión grave no corregida (PAS < percentil 3)",
        "Estenosis valvular grave (aórtica, pulmonar)",
        "Miocardiopatía hipertrófica obstructiva",
        "QTc prolongado (> 500 ms)",
        "Hipopotasemia o hipovolemia no corregidas",
        "Insuficiencia renal o hepática grave"
      ],
      precauciones: [
        "Hipotensión (mitigable con carga reducida o sin carga, ajustar volemia previa)",
        "Taquicardia, arritmias (FA, extrasistolia)",
        "Hipopotasemia — vigilar y reponer",
        "Cefalea, náuseas",
        "Efecto inotrópico sostenido 7-10 días tras la infusión por metabolito activo OR-1896"
      ]
    }
  },

  {
    nombre: "LORATADINA",
    categoria: "Antihistamínico",
    sinonimos: ["clarityne", "loratadina", "civeran"],
    isoColor: ISO.respiratorio,
    icono: "🤧",
    vias: ["oral"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Rinitis alérgica / urticaria — pauta por peso",
        via: "oral",
        dosis_fija_mg: 5,
        intervalo_h: 24,
        nota: "Antihistamínico H1 de 2.ª generación, no sedante. Pauta por peso/edad: 2-12 años con < 30 kg → 5 mg/día (5 ml jarabe); ≥ 30 kg o > 12 años → 10 mg/día. Una sola toma diaria. Edad mínima 2 años. Inicio del efecto en 1-3 h, duración 24 h.",
        preparados: [
          { nombre: "Clarityne jarabe 1 mg/ml (5 mg/5 ml)", conc_mg_ml: 1 },
          { nombre: "Clarityne comprimidos 10 mg", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Rinitis alérgica estacional y perenne (≥ 2 años)",
        "Urticaria crónica idiopática",
        "Conjuntivitis alérgica (coadyuvante)"
      ],
      contraindicaciones: [
        "Hipersensibilidad al fármaco",
        "Insuficiencia hepática grave (ajustar dosis)"
      ],
      precauciones: [
        "Sedación poco frecuente (2.ª generación)",
        "Cefalea, sequedad de boca",
        "Ajustar en insuficiencia hepática grave",
        "Sin efecto significativo sobre QTc a dosis recomendadas"
      ]
    }
  },

  {
    nombre: "LORAZEPAM",
    categoria: "Antiepiléptico / Sedante",
    sinonimos: ["orfidal", "lorazepam", "idalprem"],
    isoColor: ISO.neuro,
    icono: "🧠",
    vias: ["iv", "sl", "oral"],
    modos: ["puntual"],
    fuente: "SEUP / Pediamécum",
    puntual: {
      descripcion: "Estatus epiléptico / Crisis convulsiva activa",
      dosis_mg_kg: 0.1,
      dosis_max_mg: 4,
      via: "IV lento (máx. 2 mg/min). Alternativa sublingual/oral en ansiólisis.",
      nota: "Benzodiacepina de elección en estatus epiléptico junto a midazolam y diazepam: 0,1 mg/kg IV (máx. 4 mg), administrar lento; puede repetirse a los 5-10 min. Su efecto anticonvulsivante dura más que el del diazepam. Si no hay acceso IV, el midazolam bucal/IM es preferible. Ansiólisis: 0,05 mg/kg sublingual u oral (máx. 2 mg). Vigilar depresión respiratoria. Antídoto: flumazenilo."
    },
    info: {
      indicaciones: [
        "Estatus epiléptico (benzodiacepina de primera línea)",
        "Crisis convulsiva activa",
        "Ansiólisis/sedación previa a procedimientos (sublingual/oral)",
        "Agitación aguda en adolescentes (uso seleccionado)"
      ],
      contraindicaciones: [
        "Hipersensibilidad a benzodiacepinas",
        "Insuficiencia respiratoria grave sin soporte",
        "Miastenia gravis",
        "Glaucoma de ángulo cerrado agudo"
      ],
      precauciones: [
        "Depresión respiratoria — material de soporte ventilatorio disponible",
        "Sedación prolongada (vida media intermedia-larga)",
        "Antídoto: flumazenilo (uso muy cuidadoso si crisis activa)",
        "Excitación paradójica en algunos niños"
      ]
    }
  },

  {
    nombre: "MALATIÓN 0,5%",
    categoria: "Dermatología",
    sinonimos: ["malation", "malatión", "filvit malation"],
    isoColor: ISO.neutral,
    icono: "🧴",
    vias: ["top"],
    modos: ["puntual"],
    fuente: "Pediamécum (AEP)",
    puntual: {
      descripcion: "Pediculosis capitis resistente a otros tratamientos",
      dosis_fija_mg: 0,
      via: "Aplicación tópica sobre cuero cabelludo seco",
      nota: "Loción al 0,5%. Aplicar sobre cuero cabelludo y cabello **secos** hasta empapar bien (≈ 20-30 ml). Dejar actuar 8-12 horas (preferiblemente toda la noche, cubrir con gorro). Aclarar con champú habitual y peinar con lendrera. **Repetir a los 7-10 días**. Edad mínima ≥ 2 años (algunos protocolos ≥ 6 meses con precaución). Pediculicida organofosforado con actividad ovicida parcial. Actualmente reservado a casos resistentes a dimeticona o permetrina por su olor, inflamabilidad y mayor potencial irritante. **Muy inflamable**: no aplicar con secador caliente, planchas, ni acercar llamas o cigarrillos. Olor desagradable característico.",
      preparados: [
        { nombre: "Filvit loción malatión 0,5%", conc_mg_ml: null }
      ]
    },
    info: {
      indicaciones: [
        "Pediculosis capitis refractaria a dimeticona/permetrina (≥ 2 años)",
        "Pediculosis pubis (uso adolescente, infrecuente en pediatría)"
      ],
      contraindicaciones: [
        "Hipersensibilidad al fármaco o excipientes",
        "< 2 años (datos limitados, alternativa: dimeticona)",
        "Lesiones extensas del cuero cabelludo, dermatitis exudativa",
        "Antecedente de convulsiones (absorción mínima pero precaución)"
      ],
      precauciones: [
        "**Muy inflamable** — no exponer a llamas, secador caliente o cigarrillos",
        "Olor desagradable a azufre",
        "Irritación del cuero cabelludo posible",
        "Evitar contacto con ojos y mucosas",
        "Examinar y tratar simultáneamente a contactos afectos"
      ]
    }
  },

  {
    nombre: "MANITOL",
    categoria: "Reanimación / UCIP",
    sinonimos: ["manitol", "osmofundina"],
    isoColor: ISO.rea,
    icono: "💧",
    vias: ["iv"],
    modos: ["puntual"],
    fuente: "SEUP / Pediamécum",
    puntual: {
      descripcion: "Hipertensión intracraneal / Edema cerebral",
      dosis_mg_kg: 500,
      via: "IV en 20-30 min, con filtro (riesgo de cristalización)",
      nota: "Diurético osmótico. Dosis: 0,25-1 g/kg/dosis (250-1000 mg/kg) IV en 20-30 min, repetir cada 4-6 h según respuesta y osmolaridad. Equivalencia con manitol 20%: 1,25-5 ml/kg. **Usar siempre filtro** en el sistema (puede cristalizar; calentar el frasco si hay cristales). Mantener osmolaridad sérica < 320 mOsm/L. Monitorizar diuresis, ionograma y osmolaridad. Asegurar normovolemia (produce diuresis intensa). Alternativa: suero salino hipertónico 3%."
    },
    info: {
      indicaciones: [
        "Hipertensión intracraneal aguda (TCE, edema cerebral)",
        "Edema cerebral de diversas causas",
        "Profilaxis de fracaso renal en rabdomiólisis (uso seleccionado)",
        "Glaucoma agudo (uso oftalmológico)"
      ],
      contraindicaciones: [
        "Anuria por necrosis tubular establecida",
        "Insuficiencia cardíaca congestiva grave / edema pulmonar",
        "Hemorragia intracraneal activa no controlada",
        "Deshidratación grave",
        "Hiperosmolaridad (> 320 mOsm/L)"
      ],
      precauciones: [
        "Usar filtro — el manitol cristaliza a bajas temperaturas",
        "Efecto rebote de la presión intracraneal con uso repetido",
        "Diuresis osmótica intensa: vigilar volemia, Na+, K+ y osmolaridad",
        "Sobrecarga circulatoria transitoria en la fase inicial (precaución en cardiópatas)",
        "Extravasación: irritación tisular"
      ]
    }
  },

  {
    nombre: "MEBENDAZOL",
    categoria: "Antibiótico",
    sinonimos: ["lomper", "mebendazol", "vermin"],
    isoColor: ISO.antibiotico,
    icono: "💊",
    vias: ["oral"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Oxiuriasis (enterobiasis)",
        via: "oral",
        dosis_fija_mg: 100,
        intervalo_h: 336,
        duracion: "Dosis única, repetir a las 2 semanas",
        nota: "**100 mg dosis única** (5 ml de suspensión o 1 comprimido), repetir a las 2 semanas para eliminar los huevos eclosionados tras la primera dosis. Primera línea junto con albendazol. **Edad mínima ≥ 2 años** según ficha técnica; algunos protocolos permiten uso en 6 meses-2 años con precaución (uso off-label). Tratar simultáneamente a todos los convivientes. Reforzar medidas higiénicas: lavado riguroso de manos, uñas cortas, ropa interior y sábanas a > 60 ºC, ducha matutina.",
        preparados: [
          { nombre: "Lomper suspensión 20 mg/ml (100 mg/5 ml)", conc_mg_ml: 20 },
          { nombre: "Lomper comprimidos 100 mg", conc_mg_ml: null }
        ]
      },
      {
        indicacion: "Ascaridiasis / Tricuriasis / Anquilostomiasis",
        via: "oral",
        dosis_fija_mg: 100,
        intervalo_h: 12,
        duracion: "3 días",
        nota: "100 mg c/12 h durante 3 días en cualquier edad ≥ 2 años. Útil en infestaciones mixtas. Si no hay erradicación: repetir el ciclo a las 3 semanas.",
        preparados: [
          { nombre: "Lomper suspensión 20 mg/ml", conc_mg_ml: 20 },
          { nombre: "Lomper comprimidos 100 mg", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Oxiuriasis (enterobiasis) — primera línea junto con albendazol",
        "Ascaridiasis, tricuriasis, anquilostomiasis",
        "Tenia (uso especializado, mejor praziquantel)",
        "Tratamiento empírico de helmintiasis intestinal en niños inmigrantes/adoptados"
      ],
      contraindicaciones: [
        "< 2 años (uso off-label en 6 meses-2 años con precaución)",
        "Embarazo (primer trimestre)",
        "Hipersensibilidad a benzimidazoles"
      ],
      precauciones: [
        "Náuseas, dolor abdominal, diarrea leve (efectos frecuentes y benignos)",
        "Reacciones cutáneas, neutropenia y hepatitis con uso prolongado (raras)",
        "Absorción mínima sistémica (< 10 %): mejor perfil que albendazol",
        "Convulsiones y rabdomiólisis muy raras",
        "Reforzar siempre las medidas higiénicas para evitar reinfección"
      ]
    }
  },

  {
    nombre: "MELATONINA",
    categoria: "Antiepiléptico / Sedante",
    sinonimos: ["melatonina", "circadin"],
    isoColor: ISO.neuro,
    icono: "🌙",
    vias: ["oral"],
    modos: ["intermitente"],
    fuente: "Pediamécum / Consenso AEP",
    intermitente: [
      {
        indicacion: "Insomnio de conciliación (especialmente TEA/TDAH)",
        via: "oral",
        dosis_fija_mg: 1,
        intervalo_h: 24,
        dosis_max_mg: 10,
        nota: "Iniciar 0,5-1 mg 30-60 min antes de acostarse. Titular cada 1-2 sem hasta 3-5 mg. Máx. 10 mg/noche (uso especializado). Lactantes/preescolares: no recomendado de rutina. Niños 6-12 años con TEA o TDAH: 1-5 mg habitualmente eficaz. Mantener higiene de sueño como base.",
        preparados: [
          { nombre: "Melatonina comp. 1 / 2 / 3 / 5 mg (suplementos)", conc_mg_ml: null },
          { nombre: "Melatonina gotas 1 mg/ml (algunos preparados)", conc_mg_ml: 1 },
          { nombre: "Circadin 2 mg liberación prolongada (uso ≥ 6 años, TEA)", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Insomnio de conciliación en niños con TEA",
        "Insomnio de conciliación en TDAH",
        "Trastornos del ritmo circadiano (jet lag, retraso de fase en adolescentes)",
        "Insomnio refractario a medidas conductuales"
      ],
      contraindicaciones: [
        "Hipersensibilidad",
        "Enfermedad autoinmune (uso prudente — datos limitados)"
      ],
      precauciones: [
        "Higiene de sueño y medidas conductuales son la base — la melatonina es coadyuvante",
        "Cefalea, somnolencia residual matutina (poco frecuente)",
        "Datos de seguridad a largo plazo limitados en pediatría",
        "Suplemento en España (mayoría) — la calidad varía según marca; preferir comp. farmacéuticos"
      ]
    }
  },

  {
    nombre: "MEROPENEM",
    categoria: "Antibiótico",
    sinonimos: ["meronem", "meropenem"],
    isoColor: ISO.antibiotico,
    icono: "💉",
    vias: ["iv"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Sepsis grave / Neumonía nosocomial",
        via: "iv",
        dosis_mg_kg: 20,
        intervalo_h: 8,
        dosis_max_mg: 1000,
        nota: "20 mg/kg/dosis cada 8 h (máx. 1 g/dosis). En infusión de 30 min. Considerar infusión extendida (3 h) para optimización PK/PD."
      },
      {
        indicacion: "Meningitis / Infección por gramnegativos MR",
        via: "iv",
        dosis_mg_kg: 40,
        intervalo_h: 8,
        dosis_max_mg: 2000,
        nota: "40 mg/kg/dosis cada 8 h (máx. 2 g/dosis) en meningitis. Cubre Pseudomonas, BLEE y la mayoría de gramnegativos resistentes. Reservar para infecciones documentadas o con sospecha alta de microorganismo resistente."
      }
    ],
    info: {
      indicaciones: [
        "Sepsis nosocomial con sospecha de gérmenes multirresistentes",
        "Neumonía asociada al ventilador",
        "Meningitis por gramnegativos resistentes",
        "Infecciones intraabdominales graves",
        "Fiebre y neutropenia (con/sin combinación)"
      ],
      contraindicaciones: [
        "Anafilaxia previa a betalactámicos (en ocasiones tolerada — valorar)"
      ],
      precauciones: [
        "Descenso del umbral convulsivo (especialmente con dosis altas o IRC)",
        "Mielosupresión / eosinofilia",
        "Ajuste de dosis en insuficiencia renal",
        "Reservar uso para evitar inducción de resistencias"
      ]
    }
  },

  {
    nombre: "METAMIZOL",
    categoria: "Analgesia / Antitérmico",
    sinonimos: ["nolotil", "metalgial", "metamizol", "dipirona"],
    isoColor: ISO.analgesia,
    icono: "💊",
    vias: ["oral", "iv", "im", "rectal"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Dolor moderado-intenso / fiebre",
        via: "oral",
        dosis_mg_kg: 20,
        intervalo_h: 6,
        dosis_max_mg: 1000,
        dosis_max_dia_mg: 4000,
        nota: "Edad mínima: > 3 meses o > 5 kg para uso oral. En España: muy usado en dolor moderado. Riesgo raro pero grave de agranulocitosis: limitar duración.",
        preparados: [
          { nombre: "Metalgial solución oral 500 mg/ml (gotas) — hospital", conc_mg_ml: 500 },
          { nombre: "Nolotil cápsulas 575 mg", conc_mg_ml: null },
          { nombre: "Nolotil solución oral 250 mg/ml (gotas)", conc_mg_ml: 250 }
        ]
      },
      {
        indicacion: "Dolor postoperatorio / cólico (IV)",
        via: "iv",
        dosis_mg_kg: 20,
        intervalo_h: 6,
        dosis_max_mg: 2000,
        dosis_max_dia_mg: 8000,
        nota: "Diluir en 100 ml SSF y administrar en 15-20 min (riesgo de hipotensión con bolo rápido). > 1 año."
      }
    ],
    info: {
      indicaciones: [
        "Dolor moderado-intenso (cólico renal, postoperatorio, oncológico)",
        "Fiebre refractaria a paracetamol/ibuprofeno"
      ],
      contraindicaciones: [
        "Hipersensibilidad a pirazolonas",
        "Agranulocitosis o anemia aplásica previa",
        "Porfiria aguda intermitente",
        "Déficit de G6PD",
        "< 3 meses o < 5 kg"
      ],
      precauciones: [
        "Riesgo raro pero grave de agranulocitosis (vigilar fiebre / mucositis)",
        "Hipotensión con administración IV rápida",
        "No exceder 7 días de tratamiento sin revaluar"
      ]
    }
  },

  {
    nombre: "METILPREDNISOLONA",
    categoria: "Corticoide",
    sinonimos: ["urbason", "solu-moderin", "metilprednisolona"],
    isoColor: ISO.respiratorio,
    icono: "💊",
    vias: ["iv", "oral", "im"],
    modos: ["intermitente"],
    fuente: "Pediamécum / SEUP",
    intermitente: [
      {
        indicacion: "Asma agudo grave / Reacción alérgica grave",
        via: "iv",
        dosis_mg_kg: 1,
        intervalo_h: 6,
        dosis_max_mg: 60,
        nota: "1-2 mg/kg/dosis cada 6 h (máx. 60-125 mg/dosis). Equivalencia con prednisona 1:1. Indicada cuando vía oral no es posible (vómitos, distrés respiratorio importante)."
      },
      {
        indicacion: "Mantenimiento / brote (oral)",
        via: "oral",
        dosis_mg_kg: 1,
        intervalo_h: 24,
        dosis_max_mg: 60,
        duracion: "3-5 días sin pauta descendente si corto",
        nota: "1-2 mg/kg/día en 1 toma matutina. Pautas cortas (< 7 días) no requieren descenso. La fórmula magistral hospitalaria (1 mg/ml) facilita la dosificación pediátrica.",
        preparados: [
          { nombre: "Metilprednisolona jarabe 1 mg/ml — fórmula magistral hospital", conc_mg_ml: 1 },
          { nombre: "Urbason comp. 4 / 16 / 40 mg", conc_mg_ml: null }
        ]
      },
      {
        indicacion: "Pulsos a dosis altas (uso especializado)",
        via: "iv",
        dosis_mg_kg: 30,
        intervalo_h: 24,
        dosis_max_mg: 1000,
        duracion: "3-5 días",
        nota: "10-30 mg/kg/día IV (máx. 1 g/día) en 30-60 min × 3-5 días. Indicaciones: lesión medular aguda (controvertido), glomerulonefritis rápidamente progresiva, vasculitis sistémicas, enfermedades autoinmunes con brote grave. Bajo supervisión especializada."
      }
    ],
    info: {
      indicaciones: [
        "Asma agudo moderado-grave hospitalizado",
        "Reacciones alérgicas graves (coadyuvante)",
        "Crup grave (alternativa)",
        "Enfermedades autoinmunes (LES, vasculitis)",
        "Edema de la médula espinal aguda (pulsos)",
        "Rechazo de trasplante"
      ],
      contraindicaciones: [
        "Infección sistémica no controlada",
        "Varicela activa (uso sistémico)",
        "Hipersensibilidad conocida"
      ],
      precauciones: [
        "Pulsos: monitorizar TA y glucemia durante la infusión",
        "Hiperglucemia, HTA, alteración del ánimo",
        "Inmunosupresión con uso prolongado",
        "No suspender bruscamente tras > 7-10 días"
      ]
    }
  },

  {
    nombre: "METILPREDNISOLONA ACEPONATO TÓPICO",
    categoria: "Dermatología",
    sinonimos: ["adventan", "lexxema", "metilprednisolona aceponato", "metilprednisolona crema"],
    isoColor: ISO.respiratorio,
    icono: "🧴",
    vias: ["top"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Dermatitis atópica / eccema agudo y crónico",
        via: "top",
        dosis_fija_mg: 0,
        intervalo_h: 24,
        duracion: "Hasta 2-4 semanas según evolución",
        nota: "Corticoide tópico de potencia moderada-alta (grupo III europeo). Concentración 0,1% (1 mg/g). Aplicar capa fina 1 vez al día sobre la lesión. Edad mínima 4 meses según ficha técnica (AEMPS). Formulación según contexto: emulsión y crema para zonas exudativas; pomada y ungüento para zonas secas/liquenificadas; solución cutánea para cuero cabelludo. Bajo perfil de absorción sistémica gracias a inactivación cutánea rápida.",
        preparados: [
          { nombre: "Adventan crema 1 mg/g (0,1%)", conc_mg_ml: null },
          { nombre: "Adventan pomada 1 mg/g (0,1%)", conc_mg_ml: null },
          { nombre: "Adventan emulsión cutánea 1 mg/g", conc_mg_ml: null },
          { nombre: "Adventan solución cutánea 1 mg/g (cuero cabelludo)", conc_mg_ml: null },
          { nombre: "Lexxema crema / pomada 1 mg/g", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Dermatitis atópica moderada-grave (≥ 4 meses)",
        "Eccema agudo y crónico",
        "Dermatitis de contacto, dishidrosis",
        "Liquen simple crónico, psoriasis localizada"
      ],
      contraindicaciones: [
        "Infección cutánea activa no tratada (bacteriana, vírica o fúngica)",
        "Rosácea, acné, dermatitis perioral",
        "Hipersensibilidad al fármaco",
        "< 4 meses"
      ],
      precauciones: [
        "Atrofia cutánea, telangiectasias con uso prolongado (menor riesgo que otros corticoides potentes por su rápida inactivación)",
        "Evitar contacto con ojos y mucosas",
        "Usar formulación apropiada al estado de la piel (emulsión/crema en aguda; pomada/ungüento en crónica)",
        "Limitar superficie y duración en niños pequeños",
        "Considerar alternancia con emolientes y reducir frecuencia al mejorar"
      ]
    }
  },

  {
    nombre: "MICONAZOL TÓPICO",
    categoria: "Dermatología",
    sinonimos: ["daktarin", "miconazol"],
    isoColor: ISO.antibiotico,
    icono: "🧴",
    vias: ["top"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Candidiasis cutánea / Dermatomicosis",
        via: "top",
        dosis_fija_mg: 0,
        intervalo_h: 12,
        duracion: "2-6 semanas (continuar 1-2 sem tras resolución)",
        nota: "Crema, polvo o gel cutáneo al 2% (20 mg/g). Aplicar capa fina 2 veces al día sobre la zona afecta y perilesional. Sin restricción de edad: utilizable en lactantes y neonatos. Especialmente útil en intertrigos macerados y dermatitis del pañal candidiásica con sobreinfección bacteriana, ya que cubre adicionalmente cocos Gram positivos (S. aureus, S. pyogenes). NO confundir con el gel oral de miconazol (Daktarin gel oral 2%), que se usa para muguet y candidiasis orofaríngea pero está contraindicado en < 6 meses por riesgo de atragantamiento.",
        preparados: [
          { nombre: "Daktarin crema 2% (20 mg/g)", conc_mg_ml: null },
          { nombre: "Daktarin polvo 2%", conc_mg_ml: null },
          { nombre: "Daktarin gel cutáneo 2%", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Candidiasis cutánea (dermatitis del pañal candidiásica)",
        "Tinea corporis, cruris, pedis",
        "Pitiriasis versicolor",
        "Intertrigos sobreinfectados (cubre Candida + cocos Gram +)",
        "Otomicosis (uso ORL)"
      ],
      contraindicaciones: [
        "Hipersensibilidad a imidazoles",
        "Daktarin gel oral: < 6 meses (riesgo de obstrucción de la vía aérea)"
      ],
      precauciones: [
        "Irritación local, prurito o ardor transitorio",
        "Evitar contacto con ojos",
        "Por el gel cutáneo: en pliegues hidratados puede actuar como caldo de cultivo si se aplica en exceso",
        "Si no mejora en 2-4 semanas: reevaluar diagnóstico",
        "Interacción con warfarina y otros fármacos por absorción sistémica con uso extenso prolongado (raro)"
      ]
    }
  },

  {
    nombre: "MIDAZOLAM",
    categoria: "Antiepiléptico / Sedante",
    sinonimos: ["midazolam", "dormicum"],
    isoColor: ISO.neuro,
    icono: "🧠",
    vias: ["iv", "im", "sl", "neb", "rectal"],
    modos: ["puntual", "perfusion"],
    fuente: "SEUP / Pediamécum",
    puntual: {
      descripcion: "Crisis convulsiva / sedación",
      dosis_mg_kg: 0.3,
      dosis_max_mg: 10,
      via: "Bucal/intranasal 0,3 mg/kg (máx. 10 mg) — preferida en domicilio. IV/IO 0,15-0,2 mg/kg lento (máx. 5-10 mg). IM 0,2 mg/kg.",
      nota: "Primera línea en crisis convulsivas activas en el ámbito prehospitalario y hospitalario. Inicio acción 3-5 min. Vigilar depresión respiratoria. Antídoto: flumazenilo."
    },
    presentaciones: [
      {
        label: "50 mg / 50 ml SSF (UCIP)",
        dosis_mg: 50, dilucion_ml: 50, suero: "SSF",
        concMgMl: 50 / 50,                      // 1 mg/ml
        dosisRange: "0,05 – 0,3 mg/kg/h",
        dosisMin: 0.05, softMax: 0.3, hardMax: 0.6,
        unidad: "mg/kg/h", calcTipo: "mg_kg_h"
      }
    ],
    info: {
      indicaciones: [
        "Crisis convulsiva aguda (primera línea)",
        "Sedación para procedimientos",
        "Sedoanalgesia en UCIP (perfusión)",
        "Premedicación anestésica"
      ],
      contraindicaciones: [
        "Hipersensibilidad a benzodiacepinas",
        "Glaucoma de ángulo cerrado",
        "Miastenia gravis",
        "Insuficiencia respiratoria grave sin soporte"
      ],
      precauciones: [
        "Depresión respiratoria — material de soporte ventilatorio disponible",
        "Tolerancia rápida en perfusión continua (uso > 48 h)",
        "Reacciones paradójicas en niños (agitación)",
        "Antídoto: flumazenilo"
      ]
    }
  },

  {
    nombre: "MILRINONA",
    categoria: "Reanimación / UCIP",
    sinonimos: ["milrinona", "corotrope"],
    isoColor: ISO.cardio,
    icono: "🫀",
    vias: ["iv", "io"],
    modos: ["carga_mantenimiento"],
    fuente: "Pediamécum / UCIP",
    carga: {
      descripcion: "Bajo gasto cardíaco postoperatorio / Disfunción ventricular",
      dosis_mcg_kg: 50,
      tiempo_min: 30,
      via: "IV/IO en 30-60 min (carga opcional; en neonatos a menudo se omite por riesgo de hipotensión)",
      nota: "Carga 50 mcg/kg en 10-60 min (preferir infusión lenta). Mantenimiento: 0,25-0,75 mcg/kg/min. En neonatos: iniciar directamente 0,25-0,5 mcg/kg/min sin carga. Inotropo y vasodilatador."
    },
    presentaciones: [
      {
        label: "20 mg / 100 ml SG5%",
        dosis_mg: 20, dilucion_ml: 100, suero: "Dx5%",
        concUgMl: (20 * 1000) / 100,            // 200 mcg/ml
        dosisRange: "0,25 – 0,75 mcg/kg/min",
        dosisMin: 0.25, softMax: 0.75, hardMax: 1,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      }
    ],
    info: {
      indicaciones: [
        "Bajo gasto cardíaco postoperatorio (cirugía cardíaca pediátrica)",
        "Disfunción ventricular derecha con hipertensión pulmonar",
        "Insuficiencia cardíaca refractaria"
      ],
      contraindicaciones: [
        "Estenosis valvular grave (aórtica o pulmonar)",
        "Miocardiopatía hipertrófica obstructiva"
      ],
      precauciones: [
        "Hipotensión sistémica: vigilar TA durante la carga",
        "Arritmias ventriculares en uso prolongado",
        "Trombocitopenia",
        "Ajuste de dosis en insuficiencia renal"
      ]
    }
  },

  {
    nombre: "MOMETASONA FUROATO NASAL",
    categoria: "Respiratorio",
    sinonimos: ["nasonex", "mometasona nasal"],
    isoColor: ISO.respiratorio,
    icono: "👃",
    vias: ["in"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Rinitis alérgica — pauta por edad",
        via: "in",
        dosis_fija_mg: 0,
        intervalo_h: 24,
        nota: "Espray nasal acuoso 50 mcg/aplicación. Pauta: 2-11 años → 1 aplicación en cada fosa nasal una vez al día (= 100 mcg/día). ≥ 12 años → 2 aplicaciones en cada fosa una vez al día (= 200 mcg/día). Edad mínima 2 años. Mantener constancia para conseguir efecto antiinflamatorio (mejoría en 1-2 días, máximo a los 5-7 días).",
        preparados: [
          { nombre: "Nasonex espray nasal 50 mcg/pulsación (140 dosis)", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Rinitis alérgica estacional y perenne (≥ 2 años)",
        "Pólipos nasales (≥ 18 años)",
        "Sinusitis aguda (uso seleccionado)"
      ],
      contraindicaciones: [
        "Hipersensibilidad al fármaco",
        "Infección no tratada de la mucosa nasal",
        "Cirugía o traumatismo nasal reciente sin cicatrizar"
      ],
      precauciones: [
        "Epistaxis (frecuente), irritación nasal, cefalea, faringitis",
        "Candidiasis nasofaríngea (poco frecuente)",
        "Vigilar crecimiento en uso prolongado",
        "Supresión suprarrenal con dosis muy altas (raro a dosis recomendadas)"
      ]
    }
  },

  {
    nombre: "MOMETASONA FUROATO TÓPICO",
    categoria: "Dermatología",
    sinonimos: ["elocom", "mometasona crema", "mometasona topica"],
    isoColor: ISO.respiratorio,
    icono: "🧴",
    vias: ["top"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Dermatitis atópica moderada-grave / psoriasis",
        via: "top",
        dosis_fija_mg: 0,
        intervalo_h: 24,
        duracion: "5-7 días en cara o pliegues, hasta 2-3 semanas en otras zonas",
        nota: "Corticoide tópico de potencia alta (grupo III europeo / clase II americana). Concentración 0,1% (1 mg/g). Aplicar capa fina 1 vez al día. Edad mínima 2 años. Indicado cuando los corticoides de potencia moderada no son suficientes. Disponible en crema (zonas húmedas/exudativas), pomada (zonas secas/liquenificadas) y solución cutánea (cuero cabelludo). Evitar cara, pliegues y zona del pañal salvo prescripción específica. No usar bajo oclusión.",
        preparados: [
          { nombre: "Elocom crema 1 mg/g (0,1%)", conc_mg_ml: null },
          { nombre: "Elocom pomada 1 mg/g (0,1%)", conc_mg_ml: null },
          { nombre: "Elocom solución cutánea 1 mg/g (cuero cabelludo)", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Dermatitis atópica moderada-grave (≥ 2 años)",
        "Psoriasis en placas localizada",
        "Eccema crónico, liquen simple, eccema dishidrótico",
        "Lupus discoide cutáneo"
      ],
      contraindicaciones: [
        "Infección cutánea activa no tratada (bacteriana, vírica o fúngica)",
        "Rosácea, acné, dermatitis perioral",
        "Hipersensibilidad al fármaco",
        "< 2 años"
      ],
      precauciones: [
        "Mayor riesgo de atrofia cutánea, estrías y telangiectasias por su potencia alta",
        "Absorción sistémica relevante en lactantes/niños y zonas finas — riesgo de supresión suprarrenal",
        "Limitar superficie corporal tratada y duración (preferible < 2-3 semanas)",
        "No combinar con otros corticoides tópicos en la misma zona",
        "Vigilar crecimiento si tratamiento prolongado en niños"
      ]
    }
  },

  {
    nombre: "MONTELUKAST",
    categoria: "Respiratorio",
    sinonimos: ["singulair", "montelukast"],
    isoColor: ISO.respiratorio,
    icono: "🌬️",
    vias: ["oral"],
    modos: ["intermitente"],
    fuente: "Pediamécum",
    intermitente: [
      {
        indicacion: "Asma persistente / Rinitis alérgica",
        via: "oral",
        dosis_fija_mg: 4,
        intervalo_h: 24,
        nota: "6 meses-5 años: 4 mg/día (granulado o comp. masticable). 6-14 años: 5 mg/día. ≥ 15 años: 10 mg/día. Administrar por la noche. Inicio del efecto en 24 h. Alternativa o complemento a corticoides inhalados.",
        preparados: [
          { nombre: "Montelukast granulado 4 mg sobre", conc_mg_ml: null },
          { nombre: "Montelukast masticable 4 mg / 5 mg", conc_mg_ml: null },
          { nombre: "Montelukast comp. 10 mg", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Asma persistente leve-moderada (tratamiento de mantenimiento)",
        "Asma inducida por ejercicio (preventivo)",
        "Rinitis alérgica estacional o perenne",
        "Bronquiolitis recurrente con sibilancias (uso individualizado)"
      ],
      contraindicaciones: [
        "Hipersensibilidad al fármaco"
      ],
      precauciones: [
        "Alteraciones neuropsiquiátricas (irritabilidad, insomnio, pesadillas, conducta agresiva, ideación suicida) — vigilar y notificar",
        "Cefalea, dolor abdominal",
        "Sin efecto rescate: no útil en crisis aguda"
      ]
    }
  },

  {
    nombre: "MORFINA",
    categoria: "Analgesia / Sedación",
    sinonimos: ["cloruro morfico", "morfina", "sevredol", "oramorph", "mst"],
    isoColor: ISO.analgesia,
    icono: "💉",
    vias: ["iv", "oral", "sc"],
    modos: ["puntual", "perfusion"],
    fuente: "Pediamécum (AEP) / SEUP",
    puntual: {
      descripcion: "Dolor intenso / Analgesia mayor",
      dosis_mg_kg: 0.1,
      dosis_max_mg: 5,
      via: "IV lento (en 5 min), SC o IM",
      nota: "Opioide mayor. **IV: 0,05-0,1 mg/kg/dosis** (máx. 4-5 mg/dosis inicial) lento, repetible cada 2-4 h. **Oral: 0,2-0,5 mg/kg/dosis** cada 4 h (liberación inmediata). En lactantes < 6 meses reducir dosis (mayor sensibilidad respiratoria). Titular según respuesta y sedación. Disponer SIEMPRE de naloxona y material de soporte respiratorio. Vigilar nivel de conciencia, frecuencia respiratoria y SatO2."
    },
    presentaciones: [
      {
        label: "Perfusión continua — 1 mg/ml (UCIP)",
        dosis_mg: 50, dilucion_ml: 50, suero: "SSF",
        concUgMl: (50 * 1000) / 50,             // 1000 mcg/ml
        dosisRange: "10 – 40 mcg/kg/h",
        dosisMin: 10, softMax: 40, hardMax: 60,
        unidad: "mcg/kg/h", calcTipo: "mcg_kg_h"
      }
    ],
    info: {
      indicaciones: [
        "Dolor agudo intenso (postoperatorio, traumático, oncológico, quemaduras)",
        "Sedoanalgesia en UCIP (perfusión continua)",
        "Dolor en cuidados paliativos pediátricos",
        "Edema agudo de pulmón (uso seleccionado)",
        "Crisis vasooclusiva drepanocítica"
      ],
      contraindicaciones: [
        "Depresión respiratoria sin soporte ventilatorio",
        "Hipersensibilidad a opioides",
        "Íleo paralítico, obstrucción intestinal",
        "Traumatismo craneal con alteración de conciencia (relativa, enmascara signos)",
        "Hipotensión grave no corregida"
      ],
      precauciones: [
        "Depresión respiratoria dosis-dependiente — antídoto: naloxona, material de RCP disponible",
        "Mayor sensibilidad en lactantes < 6 meses y prematuros: reducir dosis",
        "Hipotensión, bradicardia, liberación de histamina (prurito, broncoespasmo)",
        "Estreñimiento, retención urinaria, náuseas",
        "Tolerancia y dependencia con uso prolongado (retirada gradual)"
      ]
    }
  },

  {
    nombre: "MUPIROCINA TÓPICA",
    categoria: "Dermatología",
    sinonimos: ["bactroban", "mupirocina", "plasimine"],
    isoColor: ISO.antibiotico,
    icono: "🧴",
    vias: ["top"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Impétigo / Descolonización nasal de S. aureus",
        via: "top",
        dosis_fija_mg: 0,
        intervalo_h: 8,
        duracion: "5-7 días (máx. 10 días)",
        nota: "Pomada o crema 2% (20 mg/g). Impétigo: aplicar capa fina sobre las lesiones limpias 3 veces al día durante 5-7 días (máx. 10 días). Descolonización nasal de S. aureus: aplicar en el interior de las narinas 2-3 veces/día × 5 días. Cubre S. aureus (incluido SARM) y S. pyogenes. Alternativa primera línea al ácido fusídico en impétigo localizado.",
        preparados: [
          { nombre: "Bactroban pomada 20 mg/g (2%)", conc_mg_ml: null },
          { nombre: "Plasimine pomada 20 mg/g (2%)", conc_mg_ml: null },
          { nombre: "Bactroban nasal 20 mg/g (2%) — pomada nasal", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Impétigo no extenso (forma localizada)",
        "Foliculitis superficial",
        "Descolonización nasal de S. aureus (incluido SARM)",
        "Prevención de infección de heridas menores"
      ],
      contraindicaciones: [
        "Hipersensibilidad a mupirocina o polietilenglicol (excipiente de la pomada)"
      ],
      precauciones: [
        "No usar > 10 días para evitar resistencias",
        "Evitar contacto con ojos y mucosas (salvo la pomada nasal específica)",
        "En infecciones extensas o sistémicas: tratamiento sistémico",
        "Irritación local leve, prurito ocasional"
      ]
    }
  },

  // ── N ─────────────────────────────────────────────────────
  {
    nombre: "NALOXONA",
    categoria: "Reanimación / UCIP",
    sinonimos: ["naloxona", "narcan"],
    isoColor: ISO.rea,
    icono: "🛡️",
    vias: ["iv", "im", "io", "neb"],
    modos: ["puntual"],
    fuente: "SEUP / Pediamécum",
    puntual: {
      descripcion: "Sobredosis o intoxicación por opiáceos",
      dosis_mg_kg: 0.01,
      dosis_max_mg: 2,
      via: "IV/IO/IM 0,01 mg/kg (mínimo 0,1 mg, máximo 2 mg/dosis). Intranasal: 2-4 mg en adolescentes.",
      nota: "Repetir cada 2-3 min hasta respuesta. En depresión respiratoria por opiáceos puede precisar perfusión: 0,005-0,01 mg/kg/h. Vida media corta: vigilar resedación tras antagonismo inicial."
    },
    info: {
      indicaciones: [
        "Depresión respiratoria inducida por opiáceos",
        "Sospecha de intoxicación por opioides",
        "Reversión postanestésica de opiáceos"
      ],
      contraindicaciones: [
        "Ninguna en situación vital"
      ],
      precauciones: [
        "Síndrome de abstinencia en pacientes con dependencia (incluyendo neonatos de madre adicta)",
        "Resedación: vigilar 2-4 h tras la última dosis",
        "Edema agudo de pulmón (raro)"
      ]
    }
  },

  {
    nombre: "NAPROXENO",
    categoria: "Analgesia / Antitérmico",
    sinonimos: ["naproxeno", "antalgin", "naprosyn"],
    isoColor: ISO.analgesia,
    icono: "💊",
    vias: ["oral"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Dolor / Antiinflamatorio (artritis idiopática juvenil)",
        via: "oral",
        dosis_mg_kg: 7,
        intervalo_h: 12,
        dosis_max_mg: 500,
        dosis_max_dia_mg: 1000,
        nota: "AINE de vida media larga (cómodo cada 12 h). Dolor: 5-7 mg/kg/dosis cada 12 h. Artritis idiopática juvenil: 10-15 mg/kg/día divididos en 2 tomas (máx. 1 g/día). Edad mínima ≥ 2 años. Tomar con alimentos. Útil cuando interesa una posología cómoda de 2 tomas al día frente al ibuprofeno (3-4 tomas).",
        preparados: [
          { nombre: "Naproxeno comprimidos 250 / 500 mg", conc_mg_ml: null },
          { nombre: "Naproxeno sódico comprimidos 275 / 550 mg", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Artritis idiopática juvenil (AINE de elección por posología cómoda)",
        "Dolor musculoesquelético, traumático",
        "Dismenorrea en adolescentes",
        "Dolor inflamatorio leve-moderado"
      ],
      contraindicaciones: [
        "< 2 años (datos limitados)",
        "Úlcera péptica activa, hemorragia digestiva",
        "Insuficiencia renal, hepática o cardíaca grave",
        "Asma inducido por AINE, alergia a AINE",
        "Deshidratación / hipovolemia"
      ],
      precauciones: [
        "Toxicidad gastrointestinal (tomar con alimentos)",
        "Nefrotoxicidad — evitar en deshidratación",
        "Fotosensibilidad",
        "No combinar con otros AINE"
      ]
    }
  },

  {
    nombre: "NISTATINA",
    categoria: "Dermatología",
    sinonimos: ["mycostatin", "nistatina"],
    isoColor: ISO.antibiotico,
    icono: "🧴",
    vias: ["top", "oral"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Candidiasis cutánea / Dermatitis del pañal por Candida (tópico)",
        via: "top",
        dosis_fija_mg: 0,
        intervalo_h: 6,
        duracion: "7-14 días (continuar varios días tras la mejoría)",
        nota: "Crema o pomada 100.000 UI/g. Aplicar capa fina 2-4 veces al día. Sin restricción de edad: útil desde el periodo neonatal. Cubre Candida spp. exclusivamente (NO cubre dermatofitos: no usar en tiñas). Útil como tópico de primera línea en candidiasis cutánea y dermatitis del pañal candidiásica en alternativa a clotrimazol y miconazol. Absorción sistémica nula tópica.",
        preparados: [
          { nombre: "Mycostatin crema 100.000 UI/g", conc_mg_ml: null },
          { nombre: "Mycostatin pomada 100.000 UI/g", conc_mg_ml: null }
        ]
      },
      {
        indicacion: "Muguet / candidiasis oral (oral)",
        via: "oral",
        dosis_fija_mg: 1,
        intervalo_h: 6,
        duracion: "7-14 días",
        nota: "Suspensión oral 100.000 UI/ml. Lactantes: 1 ml (100.000 UI) en cada cara interna de la mejilla y lengua, cuatro veces al día tras las tomas. Niños y adultos: 4-6 ml/dosis cada 6 h. Mantener en la boca el mayor tiempo posible antes de tragar. Continuar 48-72 h tras desaparición de las lesiones. Limpiar tetinas, chupetes y pezones (si lactancia materna asociada a candidiasis del pezón) durante el tratamiento.",
        preparados: [
          { nombre: "Mycostatin suspensión oral 100.000 UI/ml", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Candidiasis cutánea (uso tópico)",
        "Dermatitis del pañal candidiásica",
        "Muguet / candidiasis orofaríngea (suspensión oral)",
        "Candidiasis intestinal (oral, uso seleccionado)"
      ],
      contraindicaciones: [
        "Hipersensibilidad a nistatina"
      ],
      precauciones: [
        "Irritación local leve poco frecuente",
        "Sabor amargo de la suspensión oral — administrar tras las tomas para mejorar adherencia",
        "Sin actividad sobre dermatofitos: no es eficaz en tiñas",
        "Absorción intestinal prácticamente nula (sin efectos sistémicos)",
        "Continuar tratamiento varios días tras desaparición de lesiones para evitar recidiva"
      ]
    }
  },

  {
    nombre: "NORADRENALINA",
    categoria: "Reanimación / UCIP",
    sinonimos: ["norepinefrina", "noradrenalina"],
    isoColor: ISO.rea,
    icono: "🫀",
    vias: ["iv", "io"],
    modos: ["perfusion"],
    fuente: "Pediamécum / SEUP",
    presentaciones: [
      {
        label: "4 mg / 100 ml SG5%",
        dosis_mg: 4, dilucion_ml: 100, suero: "Dx5%",
        concUgMl: (4 * 1000) / 100,             // 40 mcg/ml
        dosisRange: "0,05 – 1 mcg/kg/min",
        dosisMin: 0.05, softMax: 1, hardMax: 2,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      },
      {
        label: "8 mg / 100 ml SG5% (concentrada)",
        dosis_mg: 8, dilucion_ml: 100, suero: "Dx5%",
        concUgMl: (8 * 1000) / 100,             // 80 mcg/ml
        dosisRange: "0,05 – 1 mcg/kg/min",
        dosisMin: 0.05, softMax: 1, hardMax: 2,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      }
    ],
    info: {
      indicaciones: [
        "Shock séptico (primera elección como vasopresor en pediatría)",
        "Shock distributivo refractario a fluidos",
        "Soporte hemodinámico postoperatorio"
      ],
      contraindicaciones: [
        "Hipovolemia no corregida"
      ],
      precauciones: [
        "Vía central obligatoria — riesgo grave de necrosis por extravasación",
        "Monitorización invasiva de PA y ECG continuo",
        "Vasoconstricción intensa: vigilar perfusión periférica y diuresis",
        "Asociar inotropo (adrenalina/dobutamina) si disfunción miocárdica"
      ]
    }
  },

  // ── O ─────────────────────────────────────────────────────
  {
    nombre: "OCTREOTIDO",
    categoria: "Endocrino",
    sinonimos: ["octreotido", "sandostatin"],
    isoColor: ISO.endocrino,
    icono: "💉",
    vias: ["iv", "sc"],
    modos: ["carga_mantenimiento"],
    fuente: "Pediamécum / Neofax",
    carga: {
      descripcion: "Quilotórax / Hipoglucemia hiperinsulinémica / Hemorragia digestiva variceal",
      dosis_mcg_kg: 1,
      tiempo_min: 5,
      via: "IV/SC en bolo lento",
      nota: "Bolo inicial 1 mcg/kg IV (máx. 50 mcg). Perfusión continua: iniciar 1 mcg/kg/h y titular hasta 5-10 mcg/kg/h según respuesta (máx. 10 mcg/kg/h). En hipoglucemia hiperinsulinémica neonatal: 5-25 mcg/kg/día SC en 3-4 dosis. Quilotórax: 1-10 mcg/kg/h IV continuo."
    },
    presentaciones: [
      {
        label: "500 mcg / 50 ml SSF",
        dosis_mg: 0.5, dilucion_ml: 50, suero: "SSF",
        concUgMl: (0.5 * 1000) / 50,            // 10 mcg/ml
        dosisRange: "1 – 10 mcg/kg/h",
        dosisMin: 0.5, softMax: 10, hardMax: 15,
        unidad: "mcg/kg/h", calcTipo: "mcg_kg_h"
      }
    ],
    info: {
      indicaciones: [
        "Quilotórax persistente (postoperatorio cirugía cardíaca, congénito)",
        "Hipoglucemia por hiperinsulinismo congénito",
        "Hemorragia digestiva variceal (varices esofágicas)",
        "Diarrea secretora refractaria",
        "Síndrome carcinoide (raro en pediatría)"
      ],
      contraindicaciones: [
        "Hipersensibilidad a octreotido"
      ],
      precauciones: [
        "Hiperglucemia o hipoglucemia (inhibición de insulina/glucagón) — vigilar glucemia",
        "Bradicardia, alteraciones de la conducción",
        "Litiasis biliar con uso prolongado",
        "Reducción de absorción intestinal con uso prolongado"
      ]
    }
  },

  {
    nombre: "OLOPATADINA OFTÁLMICA",
    categoria: "Oftalmología",
    sinonimos: ["opatanol", "olopatadina"],
    isoColor: ISO.respiratorio,
    icono: "👁️",
    vias: ["oft"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Conjuntivitis alérgica (estacional o perenne)",
        via: "oft",
        dosis_fija_mg: 0,
        intervalo_h: 12,
        nota: "Colirio 1 mg/ml. Posología: 1 gota en cada ojo afecto cada 12 h. Edad mínima 3 años. Antihistamínico H1 con efecto estabilizador de mastocitos: inicio de acción rápido y duración prolongada. Mantener mientras dure la exposición al alérgeno o el síntoma.",
        preparados: [
          { nombre: "Opatanol colirio 1 mg/ml (5 ml multidosis)", conc_mg_ml: 1 }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Conjuntivitis alérgica estacional o perenne (≥ 3 años)",
        "Prurito ocular alérgico"
      ],
      contraindicaciones: [
        "Hipersensibilidad al fármaco",
        "< 3 años (datos limitados)"
      ],
      precauciones: [
        "Escozor transitorio al instilar",
        "No usar lentes de contacto blandas durante el tratamiento",
        "Conservar el envase abierto < 4 semanas",
        "Sin efecto significativo sobre la presión intraocular"
      ]
    }
  },

  {
    nombre: "OMEPRAZOL",
    categoria: "Digestivo",
    sinonimos: ["omeprazol", "losec"],
    isoColor: ISO.digestivo,
    icono: "💊",
    vias: ["oral", "iv"],
    modos: ["intermitente"],
    fuente: "Pediamécum",
    intermitente: [
      {
        indicacion: "ERGE / Esofagitis / Profilaxis de úlcera",
        via: "oral",
        dosis_mg_kg: 1,
        intervalo_h: 24,
        dosis_max_mg: 40,
        nota: "1-2 mg/kg/día en 1-2 tomas. Administrar 30 min antes de las comidas. Indicado en ERGE con esofagitis, no en RGE fisiológico del lactante.",
        preparados: [
          { nombre: "Omeprazol cápsulas 10 mg / 20 mg / 40 mg", conc_mg_ml: null },
          { nombre: "Omeprazol fórmula magistral 2 mg/ml", conc_mg_ml: 2 }
        ]
      },
      {
        indicacion: "Profilaxis úlcera de estrés / Hemorragia digestiva alta",
        via: "iv",
        dosis_mg_kg: 1,
        intervalo_h: 24,
        dosis_max_mg: 40,
        nota: "1 mg/kg/día IV. En HDA por úlcera: bolo 1-2 mg/kg seguido de perfusión continua a 0,1 mg/kg/h."
      }
    ],
    info: {
      indicaciones: [
        "ERGE con esofagitis confirmada",
        "Úlcera péptica",
        "Profilaxis úlcera de estrés en críticos",
        "Sangrado digestivo alto"
      ],
      contraindicaciones: [
        "Hipersensibilidad",
        "Uso concomitante con clopidogrel (relativa)"
      ],
      precauciones: [
        "Reservar en RGE no complicado del lactante",
        "Posible aumento de gastroenteritis y neumonías con uso prolongado",
        "Hipomagnesemia con uso > 1 año",
        "Sin evidencia clara de beneficio en cólico del lactante"
      ]
    }
  },

  {
    nombre: "ONDANSETRÓN",
    categoria: "Antiemético",
    sinonimos: ["zofran", "ondansetron"],
    isoColor: ISO.digestivo,
    icono: "🤢",
    vias: ["oral", "iv", "sl"],
    modos: ["intermitente"],
    fuente: "SEUP / Pediamécum",
    intermitente: [
      {
        indicacion: "Vómitos en gastroenteritis aguda (protocolo hospital)",
        via: "oral",
        dosis_mg_kg: 0.15,
        intervalo_h: 8,
        dosis_max_mg: 4,
        duracion: "Dosis única generalmente suficiente para iniciar rehidratación oral",
        nota: "Protocolo hospitalario: 0,15 mg/kg con tope de 4 mg/dosis. Pauta orientativa por peso: 8-15 kg → 2 mg; 15-30 kg → 4 mg. Reduce vómitos y necesidad de fluidoterapia IV en urgencias.",
        preparados: [
          { nombre: "Ondansetrón jarabe hospitalario 0,8 mg/ml (fórmula magistral)", conc_mg_ml: 0.8 },
          { nombre: "Ondansetrón comp. bucodispersables 4 mg / 8 mg", conc_mg_ml: null },
          { nombre: "Ondansetrón solución oral comercial 4 mg/5 ml", conc_mg_ml: 0.8 }
        ]
      },
      {
        indicacion: "Vómitos persistentes / no respuesta a dosis estándar",
        via: "oral",
        dosis_mg_kg: 0.15,
        intervalo_h: 8,
        dosis_max_mg: 8,
        nota: "Dosis máxima ampliada (8 mg). Considerar en niños mayores con vómitos persistentes (15-30 kg → 4 mg; > 30 kg → 6-8 mg).",
        preparados: [
          { nombre: "Ondansetrón comp. bucodispersables 4 mg / 8 mg", conc_mg_ml: null }
        ]
      },
      {
        indicacion: "Náuseas y vómitos por quimioterapia / postoperatorio",
        via: "iv",
        dosis_mg_kg: 0.15,
        intervalo_h: 8,
        dosis_max_mg: 8,
        nota: "Diluir en 50 ml SSF y administrar en 15 min. Profilaxis preanestésica: 0,1 mg/kg (máx. 4 mg)."
      }
    ],
    info: {
      indicaciones: [
        "Vómitos en gastroenteritis aguda (uso aislado en urgencias)",
        "Profilaxis y tratamiento de náuseas y vómitos por quimioterapia",
        "Náuseas y vómitos postoperatorios"
      ],
      contraindicaciones: [
        "QTc prolongado conocido",
        "Hipersensibilidad",
        "Uso concomitante con apomorfina"
      ],
      precauciones: [
        "Prolongación del QTc (especialmente IV o dosis altas)",
        "Cefalea, estreñimiento",
        "En diarrea importante: usar con precaución (puede enmascarar deterioro)"
      ]
    }
  },

  {
    nombre: "OSELTAMIVIR",
    categoria: "Antivírico",
    sinonimos: ["tamiflu", "oseltamivir"],
    isoColor: ISO.antibiotico,
    icono: "🦠",
    vias: ["oral"],
    modos: ["intermitente"],
    fuente: "Pediamécum / SEUP",
    intermitente: [
      {
        indicacion: "Gripe (tratamiento) - peso ajustado",
        via: "oral",
        dosis_mg_kg: 3,
        intervalo_h: 12,
        dosis_max_mg: 75,
        duracion: "5 días",
        nota: "Pauta por peso (2 dosis al día): ≤ 15 kg → 30 mg; 15-23 kg → 45 mg; 23-40 kg → 60 mg; > 40 kg → 75 mg. Iniciar idealmente en las primeras 48 h de síntomas.",
        preparados: [
          { nombre: "Tamiflu suspensión 6 mg/ml", conc_mg_ml: 6 },
          { nombre: "Tamiflu cápsulas 30 / 45 / 75 mg", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Gripe confirmada o sospechada en grupos de riesgo (< 2 años, comorbilidades, ingresados)",
        "Profilaxis postexposición en grupos de riesgo"
      ],
      contraindicaciones: [
        "Hipersensibilidad"
      ],
      precauciones: [
        "Vómitos: tomar con alimentos",
        "Casos raros de alteraciones neuropsiquiátricas (notificadas)",
        "Ajustar dosis en insuficiencia renal grave"
      ]
    }
  },

  {
    nombre: "ÓXIDO DE ZINC / PASTA LASSAR",
    categoria: "Dermatología",
    sinonimos: ["oxido de zinc", "pasta lassar", "halibut", "mitosyl", "eryplast", "bepanthol", "pasta al agua"],
    isoColor: ISO.neutral,
    icono: "🧴",
    vias: ["top"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Dermatitis del pañal / Protección cutánea / Irritaciones leves",
        via: "top",
        dosis_fija_mg: 0,
        intervalo_h: 4,
        duracion: "Mientras persista la irritación",
        nota: "Aplicar capa generosa sobre la piel limpia y seca en cada cambio de pañal (en dermatitis del pañal) o varias veces al día (otras irritaciones). Actúa como **barrera mecánica** protectora, secante y astringente; no es un medicamento sino un protector cutáneo. Sin restricción de edad: utilizable desde el periodo neonatal. Si la dermatitis del pañal no mejora en 2-3 días, valorar componente candidiásico (añadir nistatina/clotrimazol/miconazol) o bacteriano. La fórmula clásica de **Pasta Lassar** es: óxido de zinc 25 % + almidón 25 % + vaselina filante 50 %. Existen múltiples preparados comerciales con diferentes concentraciones de ZnO y excipientes adicionales (aceite de hígado de bacalao, dexpantenol, vitamina A, etc.).",
        preparados: [
          { nombre: "Pasta Lassar fórmula magistral (ZnO 25%)", conc_mg_ml: null },
          { nombre: "Halibut pomada (óxido de zinc + aceite hígado bacalao + vit A)", conc_mg_ml: null },
          { nombre: "Mitosyl crema (óxido de zinc + aceite hígado bacalao)", conc_mg_ml: null },
          { nombre: "Eryplast crema (óxido de zinc 23%)", conc_mg_ml: null },
          { nombre: "Bepanthol pomada (dexpantenol + lanolina, sin ZnO)", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Dermatitis del pañal (irritativa) — primera línea",
        "Profilaxis de dermatitis del pañal",
        "Intertrigo, irritaciones cutáneas leves",
        "Eccema impetiginizado leve (efecto secante)",
        "Pequeñas erosiones y excoriaciones"
      ],
      contraindicaciones: [
        "Hipersensibilidad a alguno de los excipientes (aceite de hígado de bacalao en algunos productos: alergia al pescado)"
      ],
      precauciones: [
        "Sin riesgo sistémico — perfil de seguridad excelente desde neonatos",
        "Limpiar suavemente con cada cambio de pañal antes de reaplicar (no hace falta retirar capa profunda)",
        "Combinable con antifúngico tópico cuando hay candidiasis confirmada (aplicar primero antifúngico, dejar absorber, después óxido de zinc)",
        "NO aplicar sobre lesiones supurativas extensas sin diagnóstico",
        "Si no mejora en 3-5 días con cuidados óptimos: valorar dermatitis atópica, candidiasis o componente bacteriano"
      ]
    }
  },

  // ── P ─────────────────────────────────────────────────────
  {
    nombre: "PARACETAMOL",
    categoria: "Analgesia / Antitérmico",
    sinonimos: ["paracetamol", "apiretal", "acetaminofen", "perfalgan", "gelocatil"],
    isoColor: ISO.analgesia,
    icono: "🌡️",
    vias: ["oral", "iv", "rectal"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP) / SEUP",
    intermitente: [
      {
        indicacion: "Fiebre / dolor leve-moderado",
        via: "oral",
        dosis_mg_kg: 15,
        intervalo_h: 6,
        dosis_max_mg: 1000,
        dosis_max_dia_mg: 4000,
        nota: "10-15 mg/kg/dosis cada 4-6 h. Máx. 60 mg/kg/día (75 mg/kg/día en < 10 kg). Primera línea para fiebre y dolor en lactantes y niños.",
        preparados: [
          { nombre: "Apiretal solución 100 mg/ml (gotas)", conc_mg_ml: 100 },
          { nombre: "Gelocatil 100 mg/ml solución oral", conc_mg_ml: 100 },
          { nombre: "Termalgin 24 mg/ml suspensión", conc_mg_ml: 24 }
        ]
      },
      {
        indicacion: "Vía rectal",
        via: "rectal",
        dosis_mg_kg: 20,
        intervalo_h: 6,
        dosis_max_mg: 1000,
        dosis_max_dia_mg: 4000,
        nota: "Biodisponibilidad rectal ~ 60-80 %: usar dosis 20 mg/kg. Preferible la vía oral siempre que sea posible.",
        preparados: [
          { nombre: "Paracetamol supositorios 150 / 250 / 325 / 500 / 650 mg", conc_mg_ml: null }
        ]
      },
      {
        indicacion: "IV — Lactantes < 10 kg (incluye neonatos)",
        via: "iv",
        dosis_mg_kg: 7.5,
        intervalo_h: 6,
        nota: "Pediamécum: < 10 kg → 7,5 mg/kg/dosis cada 6 h, máx. 30 mg/kg/día. Neonatos a término: 7,5 mg/kg cada 4-6 h (máx. 30 mg/kg/día). Pretérminos > 32 sem: 7,5 mg/kg cada 8-12 h. Infusión en 15 min. ⚠️ La dosis de 15 mg/kg solo aplica a partir de 10 kg.",
        preparados: [
          { nombre: "Perfalgan IV 10 mg/ml", conc_mg_ml: 10 }
        ]
      },
      {
        indicacion: "IV — Niños y adolescentes ≥ 10 kg",
        via: "iv",
        dosis_mg_kg: 15,
        intervalo_h: 6,
        dosis_max_mg: 1000,
        dosis_max_dia_mg: 4000,
        nota: "Pediamécum: 10-33 kg → 15 mg/kg/dosis cada 6 h (máx. 60 mg/kg/día, sin superar 2 g/día). 33-50 kg → 15 mg/kg/dosis (máx. 3 g/día). > 50 kg → 1 g cada 6 h (máx. 4 g/día). Infusión en 15 min.",
        preparados: [
          { nombre: "Perfalgan IV 10 mg/ml", conc_mg_ml: 10 }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Fiebre (primera elección)",
        "Dolor leve-moderado",
        "Antitérmico de elección en < 3 meses",
        "Coadyuvante con AINE en dolor moderado"
      ],
      contraindicaciones: [
        "Hipersensibilidad",
        "Insuficiencia hepática grave"
      ],
      precauciones: [
        "Sobredosis: hepatotoxicidad — N-acetilcisteína como antídoto",
        "Reducir dosis en hepatopatía",
        "Valorar tope diario en tratamientos largos / desnutrición",
        "No mezclar diferentes preparados con paracetamol"
      ]
    }
  },

  {
    nombre: "PERMETRINA TÓPICA",
    categoria: "Dermatología",
    sinonimos: ["sarcop", "permetrina", "permetrin"],
    isoColor: ISO.neutral,
    icono: "🧴",
    vias: ["top"],
    modos: ["puntual"],
    fuente: "Pediamécum (AEP)",
    puntual: {
      descripcion: "Escabiosis (sarna)",
      dosis_fija_mg: 0,
      via: "Aplicación tópica única en todo el cuerpo (del cuello hacia abajo, incluyendo plantas y palmas en lactantes)",
      nota: "Crema al 5%. Aplicar en capa fina sobre todo el cuerpo (excluida cabeza salvo en lactantes y ancianos: incluir cuero cabelludo y cara evitando ojos/boca), prestar atención a pliegues, espacios interdigitales y región umbilical. Dejar actuar 8-12 h (idealmente toda la noche) y lavar. Repetir aplicación a los 7 días. Tratar simultáneamente a todos los convivientes. Lavar ropa y sábanas a > 60 ºC o aislar en bolsa cerrada 72 h. Edad mínima 2 meses. En < 2 meses valorar azufre al 6-10% como alternativa."
    },
    info: {
      indicaciones: [
        "Escabiosis (sarna) en ≥ 2 meses",
        "Pediculosis capitis y corporis (alternativa)"
      ],
      contraindicaciones: [
        "Hipersensibilidad a permetrina o piretroides",
        "< 2 meses (datos limitados; valorar azufre tópico)"
      ],
      precauciones: [
        "Irritación, prurito y eritema transitorios tras aplicación",
        "Evitar contacto con ojos, boca y mucosas",
        "El prurito puede persistir 2-4 semanas tras tratamiento eficaz (reacción a antígenos del ácaro); no es indicación de retratamiento inmediato",
        "Tratar a todos los convivientes y contactos íntimos en la misma fecha aunque estén asintomáticos"
      ]
    }
  },

  {
    nombre: "POLIETILENGLICOL",
    categoria: "Digestivo",
    sinonimos: ["movicol", "polietilenglicol", "casenglicol", "macrogol"],
    isoColor: ISO.digestivo,
    icono: "💩",
    vias: ["oral"],
    modos: ["intermitente"],
    fuente: "Pediamécum / SEUP",
    intermitente: [
      {
        indicacion: "Estreñimiento funcional (mantenimiento)",
        via: "oral",
        dosis_mg_kg: 400,
        intervalo_h: 24,
        nota: "Macrogol 3350. Mantenimiento: 0,4-0,8 g/kg/día. Movicol pediátrico (6,9 g/sobre) = 1 sobre/10 kg/día. > 12 años: 1-2 sobres/día. Mezclar con agua/zumo. Primera línea en estreñimiento crónico funcional.",
        preparados: [
          { nombre: "Movicol pediátrico 6,9 g sobre", conc_mg_ml: null },
          { nombre: "Movicol 13,7 g sobre (adultos)", conc_mg_ml: null }
        ]
      },
      {
        indicacion: "Desimpactación fecal",
        via: "oral",
        dosis_mg_kg: 1500,
        intervalo_h: 24,
        duracion: "3-6 días",
        nota: "1-1,5 g/kg/día durante 3-6 días hasta resolución (máx. 100 g/día). Repartir en varias tomas. Vigilar tolerancia hídrica y vómitos."
      }
    ],
    info: {
      indicaciones: [
        "Estreñimiento crónico funcional (primera elección, ≥ 6 meses)",
        "Desimpactación fecal (oral)",
        "Preparación intestinal antes de pruebas"
      ],
      contraindicaciones: [
        "Obstrucción intestinal mecánica",
        "Megacolon tóxico",
        "Perforación intestinal"
      ],
      precauciones: [
        "Distensión abdominal, náuseas, vómitos al inicio: ajustar dosis",
        "Riesgo de aspiración en niños con disfagia o trastornos neurológicos",
        "Bien tolerado en uso prolongado",
        "Diluir adecuadamente para mejorar palatabilidad"
      ]
    }
  },

  {
    nombre: "POVIDONA YODADA",
    categoria: "Dermatología",
    sinonimos: ["betadine", "topionic", "povidona yodada", "povidona iodada"],
    isoColor: ISO.antibiotico,
    icono: "🧴",
    vias: ["top"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP) / AEMPS",
    intermitente: [
      {
        indicacion: "Antisepsia de la piel / heridas",
        via: "top",
        dosis_fija_mg: 0,
        intervalo_h: 8,
        duracion: "Según indicación clínica",
        nota: "Antiséptico de amplio espectro frente a bacterias Gram + y Gram -, hongos, virus y protozoos. **Solución acuosa al 10%** (1 mg yodo libre/ml): heridas, mucosas, lavados quirúrgicos. **Gel 10%**: heridas. **⚠️ PRECAUCIÓN ESPECIAL EN NEONATOS Y LACTANTES < 6 MESES**: la AEMPS contraindica el uso rutinario de povidona yodada en neonatos y lactantes pequeños por absorción cutánea del yodo y riesgo de **hipotiroidismo transitorio**. En esta franja preferir clorhexidina acuosa. En niños mayores y adolescentes uso convencional. Aplicar sobre la piel limpia, dejar secar al aire (no cubrir con apósito mientras esté húmedo). Tinción amarillo-marrón reversible.",
        preparados: [
          { nombre: "Betadine solución 10% (cutánea)", conc_mg_ml: null },
          { nombre: "Betadine gel 10%", conc_mg_ml: null },
          { nombre: "Topionic solución 10%", conc_mg_ml: null },
          { nombre: "Betadine jabón 7,5% (lavado quirúrgico)", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Antisepsia de heridas en > 6 meses",
        "Antisepsia pre-procedimientos en niños mayores",
        "Lavado quirúrgico de manos (jabón)",
        "Curas de quemaduras leves-moderadas"
      ],
      contraindicaciones: [
        "**Neonatos y lactantes < 6 meses** (uso rutinario; valorar caso por caso bajo control si imprescindible)",
        "Hipersensibilidad al yodo",
        "Hipertiroidismo no controlado, bocio nodular tóxico",
        "Tratamiento simultáneo con litio (interacción con función tiroidea)",
        "Antes y después de pruebas con yodo radiactivo o estudios tiroideos"
      ],
      precauciones: [
        "Hipotiroidismo transitorio por absorción cutánea de yodo (lactantes, uso extenso, piel lesionada o quemada)",
        "Tinción amarillo-marrón reversible de piel y tejidos",
        "Dermatitis de contacto, raras veces anafilaxia",
        "Reduce su actividad en presencia de sangre, pus o materia orgánica",
        "**En heridas pediátricas habituales preferir clorhexidina acuosa**, especialmente en lactantes y zonas extensas"
      ]
    }
  },

  {
    nombre: "PREDNISOLONA",
    categoria: "Corticoide",
    sinonimos: ["estilsona", "prednisolona", "dacortin"],
    isoColor: ISO.respiratorio,
    icono: "💊",
    vias: ["oral", "iv"],
    modos: ["intermitente"],
    fuente: "Pediamécum / SEUP",
    intermitente: [
      {
        indicacion: "Asma exacerbación / Crup leve-moderado",
        via: "oral",
        dosis_mg_kg: 1,
        intervalo_h: 24,
        dosis_max_mg: 60,
        duracion: "3-5 días",
        nota: "Dosis 1-2 mg/kg/día (asma: 1-2 mg/kg/día × 3-5 días sin pauta descendente si corto). Prednisolona base = Estilsona (7 mg/ml) según escala de gotas. Considerar dexametasona única como alternativa.",
        preparados: [
          { nombre: "Estilsona gotas 13,3 mg/ml (1 gota = 0,33 mg)", conc_mg_ml: 13.3 },
          { nombre: "Dacortin comprimidos 2,5 / 5 / 30 mg", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Asma agudo moderado-grave",
        "Crup moderado (alternativa a dexametasona)",
        "Síndrome nefrótico (dosis altas)",
        "Reacciones alérgicas, urticaria"
      ],
      contraindicaciones: [
        "Infección sistémica no controlada",
        "Varicela activa (uso sistémico)"
      ],
      precauciones: [
        "Pauta corta (< 7 días) sin necesidad de descenso",
        "Hiperglucemia, alteración del ánimo, incremento del apetito",
        "Inmunosupresión con dosis altas o prolongadas"
      ]
    }
  },

  {
    nombre: "PROPOFOL",
    categoria: "Analgesia / Sedación",
    sinonimos: ["propofol", "diprivan"],
    isoColor: ISO.neuro,
    icono: "💉",
    vias: ["iv"],
    modos: ["puntual", "perfusion"],
    fuente: "Pediamécum / SEUP",
    puntual: {
      descripcion: "Inducción anestésica / Sedación procedimientos",
      dosis_mg_kg: 2,
      dosis_max_mg: 200,
      via: "IV en 1-2 min. Sedación procedimientos: 1-2 mg/kg inicial, repetir 0,5-1 mg/kg si precisa.",
      nota: "Inicio acción 30-60 s, duración 5-10 min. Dolor en sitio de inyección: añadir lidocaína al 1% (0,5 mg/kg) o usar vena gruesa. Vigilar depresión respiratoria e hipotensión. Sedación profunda: requiere personal entrenado en vía aérea."
    },
    presentaciones: [
      {
        label: "Propofol 1% (10 mg/ml) — perfusión UCIP",
        dosis_mg: 200, dilucion_ml: 20, suero: "Puro",
        concMgMl: 10,
        dosisRange: "1 – 4 mg/kg/h (no > 4 mg/kg/h ni > 48 h)",
        dosisMin: 1, softMax: 4, hardMax: 5,
        unidad: "mg/kg/h", calcTipo: "mg_kg_h"
      }
    ],
    info: {
      indicaciones: [
        "Sedoanalgesia para procedimientos breves",
        "Inducción anestésica",
        "Sedación corta en intubación",
        "Sedación en UCIP (uso limitado en pediatría)"
      ],
      contraindicaciones: [
        "Alergia a huevo o soja (relativa, revisar formulación)",
        "Trastornos del metabolismo lipídico",
        "Edad < 1 mes para perfusión prolongada"
      ],
      precauciones: [
        "Síndrome de infusión de propofol (PRIS): acidosis, rabdomiólisis, fallo multiorgánico. EVITAR dosis > 4 mg/kg/h y duración > 48 h en pediatría",
        "Hipotensión y depresión respiratoria — soporte ventilatorio disponible",
        "No tiene efecto analgésico — asociar opioide en procedimientos dolorosos",
        "Riesgo de contaminación bacteriana: cambiar línea cada 6-12 h"
      ]
    }
  },

  {
    nombre: "PROPRANOLOL",
    categoria: "Cardiología",
    sinonimos: ["propranolol", "sumial", "hemangiol"],
    isoColor: ISO.cardio,
    icono: "💊",
    vias: ["oral", "iv"],
    modos: ["intermitente"],
    fuente: "Pediamécum",
    intermitente: [
      {
        indicacion: "Hemangioma infantil (Hemangiol)",
        via: "oral",
        dosis_mg_kg: 1,
        intervalo_h: 12,
        nota: "Iniciar 1 mg/kg/día dividido en 2 dosis (titular semanal hasta 3 mg/kg/día). Hemangiol 3,75 mg/ml solución pediátrica. Iniciar con monitorización TA y FC; vigilar hipoglucemia. Continuar 6-12 meses según evolución.",
        preparados: [
          { nombre: "Hemangiol solución 3,75 mg/ml (hemangiomas)", conc_mg_ml: 3.75 },
          { nombre: "Sumial comp. 10 / 40 mg", conc_mg_ml: null }
        ]
      },
      {
        indicacion: "Cardiología pediátrica / Profilaxis migraña / Temblor",
        via: "oral",
        dosis_mg_kg_dia: 1,
        intervalo_h: 8,
        dosis_max_dia_mg: 240,
        nota: "1-4 mg/kg/día divididos cada 6-8 h. Indicaciones: arritmias, tetralogía de Fallot (crisis hipoxémicas), HTA, profilaxis migraña en adolescentes, temblor esencial, tirotoxicosis.",
        preparados: [
          { nombre: "Sumial comp. 10 / 40 mg", conc_mg_ml: null }
        ]
      },
      {
        indicacion: "Crisis hipoxémica en TOF / Taquiarritmia (IV)",
        via: "iv",
        dosis_mg_kg: 0.05,
        intervalo_h: 6,
        dosis_max_mg: 1,
        nota: "0,02-0,1 mg/kg IV lento en 5 min (máx. 1 mg en lactantes, 3 mg en niños mayores). Monitorización ECG y TA. Útil en crisis hipoxémica de tetralogía de Fallot."
      }
    ],
    info: {
      indicaciones: [
        "Hemangioma infantil (primera línea)",
        "Tetralogía de Fallot (prevención de crisis hipoxémicas)",
        "Arritmias supraventriculares",
        "HTA",
        "Profilaxis de migraña en adolescentes",
        "Tirotoxicosis"
      ],
      contraindicaciones: [
        "Asma activo / hiperreactividad bronquial",
        "Bloqueo AV 2.º-3.er grado, bradicardia significativa",
        "Insuficiencia cardíaca descompensada",
        "Hipoglucemia o riesgo de hipoglucemia (lactantes en ayuno)"
      ],
      precauciones: [
        "Hipoglucemia (especialmente lactantes): administrar con alimentos, no en ayuno",
        "Broncoespasmo (β no selectivo)",
        "Bradicardia, bloqueo AV",
        "Enmascara síntomas adrenérgicos de hipoglucemia en diabéticos"
      ]
    }
  },

  {
    nombre: "PROSTAGLANDINA E1 (ALPROSTADIL)",
    categoria: "Neonatos",
    sinonimos: ["alprostadil", "prostaglandina e1", "prostin"],
    isoColor: ISO.neonatal,
    icono: "👶",
    vias: ["iv"],
    modos: ["perfusion"],
    fuente: "Neofax / Pediamécum",
    presentaciones: [
      {
        label: "500 mcg / 50 ml SG5%",
        dosis_mg: 0.5, dilucion_ml: 50, suero: "Dx5%",
        concUgMl: (0.5 * 1000) / 50,            // 10 mcg/ml
        dosisRange: "0,01 – 0,1 mcg/kg/min",
        dosisMin: 0.01, softMax: 0.1, hardMax: 0.4,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      }
    ],
    info: {
      indicaciones: [
        "Mantenimiento de la permeabilidad del ductus arterioso en cardiopatías congénitas ducto-dependientes",
        "Pre y postoperatorio inmediato en cardiopatía congénita",
        "Estabilización antes del traslado a centro de referencia"
      ],
      contraindicaciones: [
        "Síndrome de dificultad respiratoria de causa pulmonar pura",
        "Atresia esofágica no diagnosticada (relativa)"
      ],
      precauciones: [
        "Apnea (10-20%) — disponer de soporte ventilatorio, preferiblemente intubar antes del traslado",
        "Hipotensión, taquicardia, bradicardia, fiebre, rubor",
        "Iniciar con 0,01-0,05 mcg/kg/min e ir subiendo según respuesta",
        "Una vez abierto el ductus, reducir a la mínima dosis efectiva (0,01-0,02 mcg/kg/min)"
      ]
    }
  },

  // ── R ─────────────────────────────────────────────────────
  {
    nombre: "RACECADOTRILO",
    categoria: "Digestivo",
    sinonimos: ["tiorfan", "racecadotrilo", "racecadotril"],
    isoColor: ISO.digestivo,
    icono: "💩",
    vias: ["oral"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Diarrea aguda (coadyuvante de la rehidratación)",
        via: "oral",
        dosis_mg_kg: 1.5,
        intervalo_h: 8,
        dosis_max_mg: 100,
        duracion: "Hasta 2 deposiciones normales (máx. 7 días)",
        nota: "Antidiarreico antisecretor (inhibidor de la encefalinasa). **1,5 mg/kg/dosis cada 8 h** (máx. 6 mg/kg/día). Edad mínima > 3 meses. SIEMPRE como complemento de la rehidratación oral, nunca en sustitución. A diferencia de la loperamida, no enlentece el tránsito (no produce íleo), por lo que es seguro en niños. Suspender al normalizarse las deposiciones o a los 7 días.",
        preparados: [
          { nombre: "Tiorfan lactantes 10 mg sobre granulado", conc_mg_ml: null },
          { nombre: "Tiorfan niños 30 mg sobre granulado", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Diarrea aguda en lactantes (> 3 meses) y niños — coadyuvante de la rehidratación",
        "Diarrea acuosa secretora"
      ],
      contraindicaciones: [
        "< 3 meses",
        "Hipersensibilidad al fármaco",
        "Diarrea con sangre o fiebre alta (sospecha de diarrea invasiva: revaluar)",
        "Insuficiencia hepática o renal (datos limitados)"
      ],
      precauciones: [
        "NUNCA sustituye a la rehidratación oral — es complementario",
        "No usar en diarrea con productos patológicos (sangre, moco, fiebre alta) sin valorar",
        "Reacciones cutáneas (eritema, exantema): poco frecuentes",
        "A diferencia de loperamida, no causa íleo ni distensión (seguro en pediatría)"
      ]
    }
  },

  {
    nombre: "RANITIDINA",
    categoria: "Digestivo",
    sinonimos: ["ranitidina", "zantac"],
    isoColor: ISO.digestivo,
    icono: "⚠️",
    vias: ["oral", "iv"],
    modos: ["intermitente"],
    fuente: "Pediamécum (histórico)",
    intermitente: [
      {
        indicacion: "⚠ Retirada en España (NDMA) — sustituir por famotidina u omeprazol",
        via: "oral",
        dosis_mg_kg: 2,
        intervalo_h: 12,
        dosis_max_mg: 150,
        nota: "RETIRADA del mercado en España y la UE desde 2020 por contaminación con N-nitrosodimetilamina (NDMA, posible carcinógeno). Si se encuentra en literatura antigua: 2-4 mg/kg/dosis c/12 h oral; 0,75-1,5 mg/kg/dosis c/6-8 h IV. SUSTITUIR por famotidina (misma indicación, perfil similar) o por un IBP (omeprazol).",
        preparados: []
      }
    ],
    info: {
      indicaciones: [
        "FÁRMACO RETIRADO en España. Se mantiene aquí únicamente como referencia histórica.",
        "Si encuentra prescripción previa de ranitidina, sustituir por famotidina equivalente o IBP."
      ],
      contraindicaciones: [
        "No comercializada actualmente"
      ],
      precauciones: [
        "Contaminación con NDMA (N-nitrosodimetilamina): posible riesgo carcinogénico",
        "Alternativa preferente: famotidina (mismo mecanismo, no afectada por el problema NDMA)",
        "Alternativa preferente: IBP (omeprazol) cuando se busca un efecto antisecretor más potente"
      ]
    }
  },

  {
    nombre: "ROCURONIO",
    categoria: "Analgesia / Sedación",
    sinonimos: ["rocuronio", "esmeron"],
    isoColor: ISO.neuro,
    icono: "💉",
    vias: ["iv", "io"],
    modos: ["puntual", "perfusion"],
    fuente: "Pediamécum / SEUP",
    puntual: {
      descripcion: "Bloqueo neuromuscular para intubación de secuencia rápida",
      dosis_mg_kg: 1,
      dosis_max_mg: 100,
      via: "IV/IO en bolo rápido (15-30 s)",
      nota: "Dosis ISR: 1-1,2 mg/kg IV en bolo. Inicio acción 30-60 s (más rápido a mayor dosis), duración 30-60 min. Antídoto: sugammadex 16 mg/kg IV en reversión inmediata, 2-4 mg/kg en reversión rutinaria. Alternativa a la succinilcolina en ISR, especialmente si hay contraindicación (hipertermia maligna, hiperpotasemia, distrofias)."
    },
    presentaciones: [
      {
        label: "100 mg / 100 ml SSF (UCIP)",
        dosis_mg: 100, dilucion_ml: 100, suero: "SSF",
        concMgMl: 100 / 100,                    // 1 mg/ml
        dosisRange: "0,3 – 0,6 mg/kg/h",
        dosisMin: 0.3, softMax: 0.6, hardMax: 1,
        unidad: "mg/kg/h", calcTipo: "mg_kg_h"
      }
    ],
    info: {
      indicaciones: [
        "Intubación orotraqueal de secuencia rápida (ISR)",
        "Bloqueo neuromuscular para ventilación mecánica prolongada en UCIP",
        "Cirugía electiva con relajación muscular",
        "Estatus asmático refractario (rara vez, para sincronía con ventilador)"
      ],
      contraindicaciones: [
        "Hipersensibilidad a rocuronio o bromuro",
        "Sin alternativa de vía aérea segura (sin posibilidad de intubar/ventilar)"
      ],
      precauciones: [
        "Vía aérea protegida obligatoria — apnea/paralización tras administración",
        "Sin efecto sedante o analgésico — asociar siempre sedoanalgesia",
        "Antídoto disponible: sugammadex (revierte el bloqueo rápidamente)",
        "Vigilar tren-de-4 para titulación en perfusión"
      ]
    }
  },

  // ── S ─────────────────────────────────────────────────────
  {
    nombre: "SACAROSA 24%",
    categoria: "Analgesia / Antitérmico",
    sinonimos: ["sacarosa", "sucrosa", "sucrose"],
    isoColor: ISO.neonatal,
    icono: "🍯",
    vias: ["oral"],
    modos: ["puntual"],
    fuente: "Protocolo hospital · evidencia neonatal",
    puntual: {
      descripcion: "Analgesia no farmacológica previa a procedimientos invasivos en lactantes ≤ 6 kg",
      dosis_fija_mg: 240,
      via: "Oral, en la lengua o cara interna de la mejilla con jeringa o chupete, 1-2 min antes del procedimiento",
      nota: "Dosis: 1-2 ml de sacarosa al 24% en lactantes ≤ 6 kg. Volumen efectivo: 0,5-2 ml según peso (≤ 1500 g: 0,1-0,5 ml; 1500-2500 g: 0,5-1 ml; término: 1-2 ml). Inicio del efecto en 2 min, duración 5-10 min. Combinar con succión no nutritiva, contacto piel-piel y lactancia materna si es posible. NO usar en > 6 kg, > 12 meses o cuando NO esté indicada vía oral."
    },
    info: {
      indicaciones: [
        "Punciones venosas y capilares en lactantes ≤ 6 kg",
        "Punción lumbar, sondajes, cura de heridas leves",
        "Aspirado nasofaríngeo, sondaje vesical",
        "Vacunación en neonatos y lactantes pequeños"
      ],
      contraindicaciones: [
        "Lactantes > 6 kg o > 12 meses (eficacia no demostrada)",
        "Contraindicación de vía oral (ayuno preanestésico, riesgo de aspiración)",
        "Enterocolitis necrotizante activa o sospecha",
        "Intolerancia a la sacarosa / galactosemia"
      ],
      precauciones: [
        "Preparación hospitalaria: 11 ml de sacarosa 64% + 19 ml de agua destilada (= 30 ml de sacarosa al 24%)",
        "No es analgesia suficiente para procedimientos muy dolorosos: combinar con otras medidas",
        "Limitar a 4-5 procedimientos/24 h (evidencia limitada en uso muy repetido)",
        "No sustituye a la analgesia farmacológica en cirugía o procedimientos mayores"
      ]
    }
  },

  {
    nombre: "SACCHAROMYCES BOULARDII",
    categoria: "Digestivo",
    sinonimos: ["ultra-levura", "ultralevura", "perenteryl", "saccharomyces boulardii", "ultra levura"],
    isoColor: ISO.digestivo,
    icono: "💧",
    vias: ["oral"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP) / ESPGHAN",
    intermitente: [
      {
        indicacion: "Diarrea aguda infecciosa (coadyuvante)",
        via: "oral",
        dosis_fija_mg: 250,
        intervalo_h: 12,
        duracion: "5-7 días",
        nota: "Probiótico (levadura). **Posología**: 250 mg dos veces al día durante 5-7 días, junto con rehidratación oral. Reduce la duración de la diarrea aguda en aproximadamente 1 día (evidencia ESPGHAN). Recomendado como coadyuvante en > 1 mes. Tomar con bebida fría o tibia (no caliente: el calor inactiva la levadura).",
        preparados: [
          { nombre: "Ultra-Levura cápsulas 50 mg / 250 mg", conc_mg_ml: null },
          { nombre: "Ultra-Levura sobres 250 mg", conc_mg_ml: null },
          { nombre: "Perenteryl cápsulas 250 mg", conc_mg_ml: null }
        ]
      },
      {
        indicacion: "Prevención de diarrea asociada a antibióticos",
        via: "oral",
        dosis_fija_mg: 250,
        intervalo_h: 12,
        duracion: "Durante el tratamiento antibiótico + 7 días después",
        nota: "250 mg dos veces al día desde el inicio del antibiótico y hasta 7 días después de finalizarlo. Reduce la incidencia de diarrea asociada a antibióticos y la recurrencia de infección por C. difficile (evidencia consistente)."
      }
    ],
    info: {
      indicaciones: [
        "Diarrea aguda infecciosa (coadyuvante a rehidratación)",
        "Prevención de diarrea asociada a antibióticos",
        "Prevención de recurrencia de C. difficile (coadyuvante al tratamiento)",
        "Diarrea del viajero (profilaxis y tratamiento)"
      ],
      contraindicaciones: [
        "Inmunodepresión grave (riesgo de fungemia)",
        "Catéter venoso central (riesgo de fungemia por translocación)",
        "Pancreatitis aguda grave",
        "Pacientes críticos en UCI/UCIP (notificados casos de fungemia)",
        "Hipersensibilidad a levaduras"
      ],
      precauciones: [
        "Casos esporádicos de fungemia por S. boulardii descritos: precaución estricta en pacientes inmunodeprimidos o con vía central",
        "Manipular sin tocar el contenido si hay alguno de los anteriores en la habitación (riesgo de contaminación cruzada)",
        "Tomar las cápsulas con bebida fría o tibia, no caliente (el calor mata la levadura)",
        "No combinar con antifúngicos sistémicos (los inactivan)"
      ]
    }
  },

  {
    nombre: "SALBUTAMOL",
    categoria: "Respiratorio",
    sinonimos: ["ventolin", "salbutamol"],
    isoColor: ISO.respiratorio,
    icono: "🌬️",
    vias: ["neb", "iv"],
    modos: ["intermitente", "perfusion"],
    fuente: "SEUP / Pediamécum",
    intermitente: [
      {
        indicacion: "Crisis asmática — nebulizado",
        via: "neb",
        dosis_mg_kg: 0.15,
        intervalo_h: 1,
        dosis_max_mg: 5,
        nota: "0,15 mg/kg/dosis (mínimo 2,5 mg, máximo 5 mg) en 3-4 ml de SSF. En crisis moderada-grave: 3 nebulizaciones en la primera hora cada 20 min. Alternativa MDI con cámara: 4-10 puffs (más eficaz en crisis leve-moderada).",
        preparados: [
          { nombre: "Ventolin solución para nebulización 5 mg/ml", conc_mg_ml: 5 }
        ]
      },
      {
        indicacion: "Cámara espaciadora (MDI)",
        via: "neb",
        dosis_fija_mg: 0.4,
        intervalo_h: 1,
        nota: "4 puffs (100 mcg/puff) en < 20 kg; 6-10 puffs en > 20 kg, con cámara espaciadora. Repetir cada 20 min hasta 3 dosis en la primera hora si crisis activa.",
        preparados: []
      }
    ],
    presentaciones: [
      {
        label: "5 mg / 50 ml SSF (UCIP)",
        dosis_mg: 5, dilucion_ml: 50, suero: "SSF",
        concUgMl: (5 * 1000) / 50,              // 100 mcg/ml
        dosisRange: "0,1 – 5 mcg/kg/min",
        dosisMin: 0.1, softMax: 5, hardMax: 10,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      }
    ],
    info: {
      indicaciones: [
        "Crisis asmática (todas las gravedades)",
        "Bronquiolitis con sospecha de broncoespasmo (uso individualizado, no rutinario)",
        "Hiperpotasemia aguda (efecto secundario aprovechado)"
      ],
      contraindicaciones: [
        "Hipersensibilidad",
        "Taquiarritmias graves"
      ],
      precauciones: [
        "Taquicardia, temblor, hipopotasemia (especialmente con nebulizaciones repetidas o IV)",
        "Hiperglucemia transitoria",
        "Valoración periódica de la respuesta para evitar uso excesivo",
        "Falta de evidencia para uso rutinario en bronquiolitis"
      ]
    }
  },

  {
    nombre: "SALES DE REHIDRATACIÓN ORAL",
    categoria: "Digestivo",
    sinonimos: ["sro", "sueroral", "bioralsuero", "isotonar", "citorsal", "rehidratacion", "suero oral"],
    isoColor: ISO.digestivo,
    icono: "💧",
    vias: ["oral"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP) / ESPGHAN",
    intermitente: [
      {
        indicacion: "Deshidratación leve-moderada por gastroenteritis aguda",
        via: "oral",
        dosis_mg_kg: 50,
        intervalo_h: 4,
        nota: "Pilar del tratamiento de la GEA. Usar **SRO hiposódicas (Na 60 mmol/L, osmolaridad ~240, según ESPGHAN)**, NO preparados caseros ni bebidas isotónicas deportivas. **Rehidratación**: reponer el déficit estimado en 3-4 h — leve (3-5%): 30-50 ml/kg; moderada (6-9%): 50-100 ml/kg, ofrecido en tomas pequeñas y frecuentes (5-10 ml cada 1-2 min con jeringa o cucharilla). **Mantenimiento de pérdidas**: 5-10 ml/kg por cada deposición líquida y 2-5 ml/kg por vómito. Continuar la alimentación normal en cuanto se corrija la deshidratación. Si vómitos: valorar ondansetrón. Si fracaso de la vía oral: rehidratación por SNG o IV.",
        preparados: [
          { nombre: "Sueroral Hyposódico sobres (Na 60 mmol/L)", conc_mg_ml: null },
          { nombre: "Bioralsuero / Bi-OralSuero (botella lista para usar)", conc_mg_ml: null },
          { nombre: "Isotonar / Citorsal / Recuperat-ion sobres", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Deshidratación leve-moderada por gastroenteritis aguda (primera elección)",
        "Prevención de la deshidratación en GEA",
        "Reposición de pérdidas en diarrea aguda",
        "Rehidratación de mantenimiento tras corrección IV"
      ],
      contraindicaciones: [
        "Deshidratación grave (> 9%) o shock (requiere rehidratación IV)",
        "Íleo paralítico u obstrucción intestinal",
        "Alteración del nivel de conciencia (riesgo de aspiración)",
        "Vómitos incoercibles sin respuesta a antieméticos"
      ],
      precauciones: [
        "Usar SRO hiposódicas de osmolaridad reducida — NO refrescos, zumos ni bebidas deportivas (hiperosmolares, empeoran la diarrea)",
        "Ofrecer en tomas pequeñas y frecuentes (mejor tolerancia que grandes volúmenes)",
        "No interrumpir la lactancia materna durante la rehidratación",
        "Reintroducir alimentación normal precozmente (no dietas restrictivas)"
      ]
    }
  },

  {
    nombre: "SALMETEROL + FLUTICASONA",
    categoria: "Respiratorio",
    sinonimos: ["seretide", "anasma", "plusvent", "inaladuo", "salmeterol fluticasona"],
    isoColor: ISO.respiratorio,
    icono: "🌬️",
    vias: ["inh"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP) / GEMA",
    intermitente: [
      {
        indicacion: "Asma persistente moderada-grave — Mantenimiento (≥ 4 años)",
        via: "inh",
        dosis_fija_mg: 0,
        intervalo_h: 12,
        nota: "Combinación **LABA (salmeterol) + corticoide inhalado (fluticasona propionato)**. **Concentraciones pediátricas**: Seretide Accuhaler 50/100 (salmeterol 50 mcg / fluticasona 100 mcg) en ≥ 4 años; 50/250 y 50/500 en ≥ 12 años. Seretide Inhalador MDI 25/50, 25/125, 25/250 (con cámara espaciadora en niños pequeños). **Posología**: 1 inhalación cada 12 h. **NO usar como rescate** (salmeterol tiene inicio de acción más lento que formoterol). **NUNCA usar el LABA en monoterapia** (sin corticoide inhalado) en asma — riesgo de muerte por asma. Enjuagar boca tras cada uso (candidiasis). Revisar técnica inhalatoria. Si no se controla con esta combinación, escalar a dosis altas o añadir LAMA/montelukast/biológico según protocolo.",
        preparados: [
          { nombre: "Seretide Accuhaler 50/100 mcg (≥ 4 años)", conc_mg_ml: null },
          { nombre: "Seretide Accuhaler 50/250 / 50/500 mcg (≥ 12 años)", conc_mg_ml: null },
          { nombre: "Seretide Inhalador MDI 25/50 / 25/125 / 25/250 mcg", conc_mg_ml: null },
          { nombre: "Plusvent / Anasma / Inaladuo (mismas presentaciones)", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Asma persistente moderada-grave en ≥ 4 años no controlada con CI solos",
        "Asma con sintomatología nocturna importante",
        "Como mantenimiento en escalones 3-4 GEMA"
      ],
      contraindicaciones: [
        "< 4 años (datos pediátricos limitados)",
        "Hipersensibilidad a alguno de los principios activos o lactosa",
        "Uso como tratamiento de rescate",
        "Asma intermitente"
      ],
      precauciones: [
        "Temblor fino, taquicardia, palpitaciones (salmeterol)",
        "Candidiasis orofaríngea, disfonía (fluticasona) — enjuagar boca tras cada uso",
        "Hipopotasemia con dosis altas",
        "**Nunca usar el LABA solo sin corticoide inhalado** — riesgo de muerte por asma",
        "Si hay empeoramiento o ausencia de mejoría: subir escalón terapéutico, no aumentar la frecuencia de uso del LABA"
      ]
    }
  },

  {
    nombre: "SUCCINILCOLINA",
    categoria: "Analgesia / Sedación",
    sinonimos: ["succinilcolina", "suxametonio", "anectine"],
    isoColor: ISO.neuro,
    icono: "💉",
    vias: ["iv", "im", "io"],
    modos: ["puntual"],
    fuente: "Pediamécum / SEUP",
    puntual: {
      descripcion: "Bloqueo neuromuscular para intubación de secuencia rápida",
      dosis_mg_kg: 1.5,
      dosis_max_mg: 150,
      via: "IV/IO en bolo rápido. Vía IM si no acceso IV: 3-4 mg/kg (máx. 150 mg).",
      nota: "IV: lactantes 2 mg/kg, niños 1-1,5 mg/kg, adolescentes 1 mg/kg. Inicio acción 30-60 s, duración 4-10 min (más corta que rocuronio). Premedicar con atropina 0,02 mg/kg en lactantes/niños pequeños (bradicardia). El rocuronio se prefiere en muchos protocolos pediátricos por mejor perfil de seguridad."
    },
    info: {
      indicaciones: [
        "Intubación orotraqueal de secuencia rápida (ISR) cuando se desea corta duración",
        "Laringoespasmo grave",
        "Inducción anestésica para procedimientos cortos"
      ],
      contraindicaciones: [
        "Antecedente personal o familiar de hipertermia maligna",
        "Hiperpotasemia conocida o riesgo (quemados > 24 h, lesión medular, denervación, distrofias musculares)",
        "Distrofia muscular de Duchenne/Becker (hiperpotasemia letal — uso restringido al fallo de vía aérea)",
        "Déficit de pseudocolinesterasa",
        "Glaucoma agudo de ángulo cerrado, lesión ocular abierta",
        "Quemados o trauma muscular extenso entre 24 h y varios meses"
      ],
      precauciones: [
        "Bradicardia (especialmente en niños y con repetición) — premedicar con atropina",
        "Hiperpotasemia (efecto despolarizante) — vigilar en grupos de riesgo",
        "Hipertermia maligna: emergencia médica (dantroleno)",
        "Mialgias postoperatorias frecuentes",
        "Aumento de presión intracraneal e intragástrica"
      ]
    }
  },

  {
    nombre: "SUERO SALINO HIPERTÓNICO 3%",
    categoria: "Reanimación / UCIP",
    sinonimos: ["salino hipertonico", "ssh", "suero hipertonico", "nacl 3%", "suero salino 3%"],
    isoColor: ISO.rea,
    icono: "💧",
    vias: ["iv", "neb"],
    modos: ["puntual", "intermitente"],
    fuente: "SEUP / Pediamécum / UCIP",
    puntual: {
      descripcion: "Hipertensión intracraneal / Hiponatremia sintomática grave",
      dosis_mg_kg: 0,
      via: "IV en 10-20 min (vía central preferente para uso repetido)",
      nota: "**HTIC**: 3-5 ml/kg de SSH 3% IV en 10-20 min (puede repetirse); alternativa al manitol, con ventaja en el paciente hipovolémico o hipotenso. **Hiponatremia sintomática grave (convulsiones por Na < 120)**: 2-5 ml/kg de SSH 3% en 10-20 min hasta ceder los síntomas; objetivo subir Na 4-6 mEq/L de forma aguda. ⚠️ NO corregir la natremia crónica más de 8-10 mEq/L en 24 h (riesgo de mielinólisis pontina). 1 ml de SSH 3% ≈ 0,5 mEq de Na. Monitorizar Na+ seriado. Vía central si uso repetido (osmolaridad alta, flebitis)."
    },
    intermitente: [
      {
        indicacion: "Bronquiolitis aguda — nebulizado (uso controvertido)",
        via: "neb",
        dosis_fija_mg: 0,
        intervalo_h: 8,
        nota: "Nebulización de 4 ml de SSH 3% (a menudo con salbutamol o SSF para minimizar broncoespasmo). Puede reducir levemente la estancia en bronquiolitis moderada hospitalizada, aunque la evidencia es heterogénea y NO se recomienda de forma rutinaria. Vigilar broncoespasmo durante la nebulización (más en lactantes pequeños). No usar en urgencias de forma sistemática.",
        preparados: [
          { nombre: "Suero salino hipertónico 3% (preparado de farmacia/UCIP)", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Hipertensión intracraneal aguda (alternativa/complemento del manitol)",
        "Hiponatremia sintomática grave (convulsiones, coma)",
        "Bronquiolitis aguda nebulizado (uso individualizado, no rutinario)"
      ],
      contraindicaciones: [
        "Hipernatremia",
        "Hipervolemia / insuficiencia cardíaca congestiva (uso IV)",
        "Corrección rápida de hiponatremia crónica (riesgo de mielinólisis)"
      ],
      precauciones: [
        "Corregir la natremia despacio: máx. 8-10 mEq/L en 24 h (mielinólisis pontina)",
        "Vía central preferente para infusiones repetidas (flebitis, osmolaridad)",
        "Monitorización seriada de Na+ y osmolaridad",
        "Nebulizado: vigilar broncoespasmo en lactantes",
        "Sobrecarga de sodio y volumen: precaución en cardiópatas y nefrópatas"
      ]
    }
  },

  {
    nombre: "SULFADIAZINA ARGÉNTICA",
    categoria: "Dermatología",
    sinonimos: ["silvederma", "flammazine", "sulfadiazina argentica", "sulfadiazina de plata"],
    isoColor: ISO.antibiotico,
    icono: "🧴",
    vias: ["top"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Quemaduras de 2.º y 3.er grado — profilaxis de infección",
        via: "top",
        dosis_fija_mg: 0,
        intervalo_h: 12,
        duracion: "Hasta epitelización (revaluar)",
        nota: "Crema al 1% (10 mg/g). Aplicar una capa de **2-3 mm** sobre la quemadura limpia y desbridada, 1-2 veces al día, cubrir con apósito. Antiséptico de elección clásico en quemaduras para prevenir la infección. ⚠️ **Evitar en < 2 meses** (riesgo de kernicterus por la sulfamida) y en **déficit de G6PD** (hemólisis). Evitar la cara y superficies muy extensas (absorción). Puede retrasar levemente la epitelización; en quemaduras menores existen alternativas (apósitos hidrocoloides, tul graso).",
        preparados: [
          { nombre: "Silvederma crema 1% (10 mg/g)", conc_mg_ml: null },
          { nombre: "Flammazine crema 1%", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Quemaduras de 2.º y 3.er grado (profilaxis y tratamiento de infección)",
        "Úlceras y heridas con riesgo de infección",
        "Profilaxis de infección en pérdidas extensas de piel"
      ],
      contraindicaciones: [
        "Lactantes < 2 meses (riesgo de kernicterus)",
        "Déficit de glucosa-6-fosfato deshidrogenasa (G6PD)",
        "Hipersensibilidad a sulfamidas o a la plata",
        "Embarazo a término y lactancia (sobre zona amplia)"
      ],
      precauciones: [
        "Leucopenia transitoria (frecuente, autolimitada): vigilar en uso extenso",
        "Absorción sistémica de sulfamida en quemaduras extensas (vigilar función renal)",
        "Argiria local (coloración grisácea) con uso muy prolongado",
        "Puede retrasar la epitelización: revaluar según evolución",
        "Evitar contacto con ojos y mucosas"
      ]
    }
  },

  {
    nombre: "SULFATO DE MAGNESIO",
    categoria: "Reanimación / UCIP",
    sinonimos: ["sulfato magnesio", "magnesio"],
    isoColor: ISO.rea,
    icono: "⚡",
    vias: ["iv"],
    modos: ["puntual"],
    fuente: "SEUP",
    puntual: {
      descripcion: "Asma grave refractario / Torsade de pointes",
      dosis_mg_kg: 40,
      dosis_max_mg: 2000,
      via: "IV en 20 min, diluido en 50-100 ml SSF",
      nota: "Asma grave: 25-50 mg/kg (máx. 2 g) en 20 min. Torsade de pointes: 25-50 mg/kg en bolo. Vigilar TA durante infusión (hipotensión). Reflejos rotulianos = monitor de toxicidad."
    },
    info: {
      indicaciones: [
        "Asma grave refractario al tratamiento broncodilatador inicial",
        "Torsade de pointes",
        "Hipomagnesemia sintomática",
        "Eclampsia (uso poco frecuente en pediatría)"
      ],
      contraindicaciones: [
        "Bloqueo AV completo",
        "Insuficiencia renal grave (relativa)"
      ],
      precauciones: [
        "Hipotensión, rubor facial, sensación de calor",
        "Toxicidad: arreflexia, depresión respiratoria, paro cardíaco (con magnesemia muy alta)",
        "Antídoto: gluconato cálcico 100 mg/kg IV",
        "Monitorización ECG y TA continuas durante infusión"
      ]
    }
  },

  {
    nombre: "SUMATRIPTÁN",
    categoria: "Analgesia / Antitérmico",
    sinonimos: ["sumatriptan", "imigran", "imitrex"],
    isoColor: ISO.analgesia,
    icono: "💊",
    vias: ["oral", "sl", "sc", "neb"],
    modos: ["intermitente"],
    fuente: "Pediamécum",
    intermitente: [
      {
        indicacion: "Migraña con/sin aura — adolescentes ≥ 12 años",
        via: "oral",
        dosis_fija_mg: 25,
        intervalo_h: 2,
        dosis_max_mg: 50,
        dosis_max_dia_mg: 100,
        nota: "≥ 12 años: 25-50 mg al inicio de la cefalea (máx. 100 mg/día). Repetir tras 2 h si no respuesta (máx. 2 dosis/24 h). Mejor en la fase precoz del ataque. Forma intranasal: 5-20 mg/dosis (Imigran nasal 10 / 20 mg).",
        preparados: [
          { nombre: "Imigran comp. 50 mg", conc_mg_ml: null },
          { nombre: "Imigran nasal 10 / 20 mg (1 nebulización)", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Tratamiento agudo de migraña con o sin aura en adolescentes ≥ 12 años",
        "Cefalea en racimos en adolescentes (forma SC, uso especializado)"
      ],
      contraindicaciones: [
        "< 12 años (datos limitados)",
        "Cardiopatía isquémica o riesgo cardiovascular elevado",
        "HTA no controlada",
        "Migraña hemipléjica o basilar",
        "ACV o AIT previos",
        "Uso concomitante con ergotamínicos o IMAO"
      ],
      precauciones: [
        "Vasoconstricción coronaria: dolor torácico opresivo posible (vigilar)",
        "Sensación de calor, parestesias, sensación de presión en cuello/tórax",
        "Cefalea de rebote con uso frecuente (> 10 días/mes): evitar uso excesivo",
        "No usar como profilaxis (es tratamiento agudo)"
      ]
    }
  },

  {
    nombre: "SURFACTANTE PULMONAR (PORACTANT ALFA)",
    categoria: "Neonatos",
    sinonimos: ["surfactante", "curosurf", "poractant", "beractant", "survanta"],
    isoColor: ISO.neonatal,
    icono: "👶",
    vias: ["it"],
    modos: ["puntual"],
    fuente: "Neofax / SEN",
    puntual: {
      descripcion: "Síndrome de distrés respiratorio del recién nacido (EMH)",
      dosis_mg_kg: 200,
      via: "Intratraqueal a través del tubo endotraqueal o por técnica LISA/INSURE",
      nota: "Curosurf (poractant alfa) — dosis inicial 100-200 mg/kg intratraqueal. Repetir 100 mg/kg cada 6-12 h si persiste necesidad de FiO2 > 30% y/o ventilación mecánica (máx. 3 dosis). Beractant (Survanta): 100 mg/kg (4 ml/kg). Técnicas: INSURE (intubación-surfactante-extubación a CPAP) o LISA (administración con catéter fino sin intubación). Vigilar SpO2 durante la administración: reajustar FiO2 y parámetros del respirador tras el bolo."
    },
    info: {
      indicaciones: [
        "Síndrome de distrés respiratorio neonatal (enfermedad de membrana hialina) — primera línea",
        "Profilaxis en prematuros extremos < 27-28 semanas (uso muy precoz)",
        "Síndrome de aspiración meconial grave (uso seleccionado)",
        "Hemorragia pulmonar masiva neonatal (rescate)"
      ],
      contraindicaciones: [
        "Hipersensibilidad al producto (excipientes)",
        "Hemorragia pulmonar activa (precaución)",
        "Inestabilidad hemodinámica grave"
      ],
      precauciones: [
        "Desaturación transitoria durante la administración: reajustar FiO2 según SpO2",
        "Reflujo del surfactante por el TET (reintubar o reposicionar)",
        "Riesgo de hemorragia pulmonar (controvertido, mayor en prematuros con DAP)",
        "Ajustar parámetros del ventilador tras la administración (mejoría rápida de la compliance)",
        "Mantener al paciente sin aspirar el TET durante 1-2 h tras la dosis (salvo necesidad)"
      ]
    }
  },

  // ── T ─────────────────────────────────────────────────────
  {
    nombre: "TACROLIMUS TÓPICO",
    categoria: "Dermatología",
    sinonimos: ["protopic", "tacrolimus pomada", "tacrolimus topico"],
    isoColor: ISO.respiratorio,
    icono: "🧴",
    vias: ["top"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Dermatitis atópica moderada-grave refractaria (≥ 2 años)",
        via: "top",
        dosis_fija_mg: 0,
        intervalo_h: 12,
        duracion: "3 semanas brote, después mantenimiento 2 veces/semana",
        nota: "Inhibidor de la calcineurina, inmunomodulador NO esteroideo. **Pediátrico (2-15 años): Protopic 0,03 % pomada**, dos veces al día hasta resolución (máx. 3 semanas), después reducir a 1 vez al día hasta control. **Mantenimiento proactivo**: 2 aplicaciones por semana sobre las zonas habitualmente afectas. **≥ 16 años: Protopic 0,1 %** dos veces al día hasta control, después igual mantenimiento. Edad mínima 2 años. Particularmente útil en **zonas donde los corticoides están desaconsejados (cara, párpados, pliegues)** porque NO produce atrofia cutánea. Sensación de quemazón/prurito al inicio (cede en pocos días). Evitar exposición solar intensa durante el tratamiento (fotoprotección obligatoria). NO usar con oclusión.",
        preparados: [
          { nombre: "Protopic 0,03% pomada (2-15 años)", conc_mg_ml: null },
          { nombre: "Protopic 0,1% pomada (≥ 16 años)", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Dermatitis atópica moderada-grave refractaria a corticoides tópicos (≥ 2 años)",
        "Dermatitis atópica en zonas sensibles (cara, párpados, pliegues, cuello)",
        "Mantenimiento proactivo en dermatitis atópica recidivante",
        "Vitíligo segmentario (uso off-label)",
        "Dermatosis inflamatorias seleccionadas"
      ],
      contraindicaciones: [
        "Hipersensibilidad a tacrolimus o macrólidos",
        "< 2 años (datos limitados; aprobación a partir de 2 años)",
        "Infecciones cutáneas activas (víricas, bacterianas, fúngicas) no tratadas",
        "Inmunodeficiencia primaria o adquirida",
        "Lesiones premalignas o malignas cutáneas"
      ],
      precauciones: [
        "**Quemazón, prurito o eritema** transitorios al inicio (60-70% de pacientes; suele ceder en 1-2 semanas)",
        "Fotoprotección obligatoria durante el tratamiento (riesgo teórico de fotocarcinogénesis)",
        "Evitar consumo de alcohol durante uso (rubor facial)",
        "Riesgo aumentado de infección herpética cutánea (eccema herpeticum): evitar contacto con personas con herpes activo",
        "Reservar para casos refractarios a corticoides tópicos (no es primera línea)"
      ]
    }
  },

  {
    nombre: "TERBUTALINA",
    categoria: "Respiratorio",
    sinonimos: ["terbasmin", "terbutalina", "bricanyl"],
    isoColor: ISO.respiratorio,
    icono: "🌬️",
    vias: ["sc", "iv", "neb"],
    modos: ["puntual", "perfusion"],
    fuente: "SEUP / Pediamécum",
    puntual: {
      descripcion: "Crisis asmática grave refractaria — vía subcutánea",
      dosis_mg_kg: 0.01,
      dosis_max_mg: 0.4,
      via: "SC o IM",
      nota: "0,01 mg/kg/dosis (máx. 0,4 mg/dosis) SC, repetir cada 20 min hasta 3 dosis si no respuesta a salbutamol nebulizado. Útil cuando no se puede nebulizar adecuadamente. Vigilar taquicardia, temblor."
    },
    presentaciones: [
      {
        label: "5 mg / 50 ml SG5% (UCIP)",
        dosis_mg: 5, dilucion_ml: 50, suero: "Dx5%",
        concUgMl: (5 * 1000) / 50,              // 100 mcg/ml
        dosisRange: "0,1 – 4 mcg/kg/min (hasta 10 en refractario)",
        dosisMin: 0.1, softMax: 4, hardMax: 10,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      }
    ],
    info: {
      indicaciones: [
        "Crisis asmática grave refractaria a salbutamol nebulizado",
        "Asma con dificultad para nebulizar adecuadamente",
        "Estatus asmático en UCIP (perfusión continua)"
      ],
      contraindicaciones: [
        "Hipersensibilidad",
        "Taquiarritmias graves no controladas"
      ],
      precauciones: [
        "Taquicardia, temblor, hipokalemia (vigilar K+ en perfusión)",
        "Hiperglucemia, acidosis láctica con dosis altas mantenidas",
        "Monitorización ECG continua si IV/perfusión",
        "En UCIP iniciar 0,1-0,4 mcg/kg/min y titular según respuesta"
      ]
    }
  },

  {
    nombre: "TOBRAMICINA OFTÁLMICA",
    categoria: "Oftalmología",
    sinonimos: ["tobrex", "tobradex", "tobramicina colirio"],
    isoColor: ISO.antibiotico,
    icono: "👁️",
    vias: ["oft"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP)",
    intermitente: [
      {
        indicacion: "Conjuntivitis bacteriana / Blefaritis",
        via: "oft",
        dosis_fija_mg: 0,
        intervalo_h: 4,
        duracion: "7 días (revaluar a las 48-72 h)",
        nota: "Colirio 0,3% (3 mg/ml) o pomada oftálmica 0,3% (3 mg/g). Posología estándar: 1-2 gotas en cada ojo afecto cada 4-6 h. En infecciones graves los 2 primeros días: 1 gota cada 30 min - 1 h, después espaciar a 4-6 h. Edad mínima: sin restricción (uso desde neonatos posible bajo control). Si no mejora en 48-72 h, reevaluar diagnóstico.",
        preparados: [
          { nombre: "Tobrex colirio 3 mg/ml (5 ml multidosis)", conc_mg_ml: 3 },
          { nombre: "Tobrex pomada oftálmica 3 mg/g", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Conjuntivitis bacteriana aguda",
        "Blefaritis bacteriana",
        "Queratitis bacteriana (uso especializado)",
        "Profilaxis post-cirugía ocular"
      ],
      contraindicaciones: [
        "Hipersensibilidad a aminoglucósidos"
      ],
      precauciones: [
        "Escozor o picor transitorios",
        "No usar > 7-10 días (resistencias, sobreinfección por hongos)",
        "Retirar lentes de contacto durante el tratamiento",
        "La mayoría de conjuntivitis pediátricas son víricas: limitar uso a casos con signos de bacteriana (secreción purulenta, edema palpebral, etc.)"
      ]
    }
  },

  {
    nombre: "TROPICAMIDA",
    categoria: "Oftalmología",
    sinonimos: ["colircusi tropicamida", "tropicamida", "midriaticum"],
    isoColor: ISO.respiratorio,
    icono: "👁️",
    vias: ["oft"],
    modos: ["puntual"],
    fuente: "Pediamécum (AEP)",
    puntual: {
      descripcion: "Midriasis diagnóstica (fondo de ojo) / Cicloplejia leve",
      dosis_fija_mg: 0,
      via: "Colirio oftálmico — instilar 1 gota en el saco conjuntival",
      nota: "Anticolinérgico midriático y ciclopléjico de **acción corta** (efecto máximo a los 30 min, duración 4-8 h). Colircusi Tropicamida 1%. **Posología**: 1 gota en cada ojo, repetir a los 5 min si fuera necesario (1-2 instilaciones según pigmentación iridiana). Comprimir saco lagrimal 1-2 min tras cada gota para reducir absorción sistémica. Preferida sobre ciclopentolato cuando se busca **solo midriasis** para fondo de ojo y no cicloplejia completa para refracción. **Edad mínima ≥ 6 meses** según ficha técnica (con precaución en lactantes). Vigilar a lactantes y niños pequeños durante 30 min tras la instilación: riesgo de toxicidad anticolinérgica (taquicardia, sequedad de boca, agitación, fiebre, alucinaciones)."
    },
    info: {
      indicaciones: [
        "Midriasis diagnóstica para fondo de ojo (uso pediátrico más frecuente)",
        "Cicloplejia leve para refracción en niños cooperadores (alternativa a ciclopentolato)",
        "Uveítis anterior leve (cicloplejia terapéutica leve)"
      ],
      contraindicaciones: [
        "Hipersensibilidad a anticolinérgicos",
        "Glaucoma de ángulo cerrado conocido o sospechado",
        "< 6 meses (datos limitados; valorar formulaciones más diluidas)"
      ],
      precauciones: [
        "Toxicidad anticolinérgica sistémica en lactantes y niños pequeños (más frecuente que con ciclopentolato por absorción)",
        "Comprimir saco lagrimal tras la instilación",
        "Fotofobia y visión borrosa hasta 6-8 h tras la administración",
        "Sequedad de mucosas, taquicardia, agitación, fiebre: signos de toxicidad",
        "En refracción objetiva real preferir ciclopentolato (cicloplejia más profunda)"
      ]
    }
  },

  // ── V ─────────────────────────────────────────────────────
  {
    nombre: "VALPROATO (ÁCIDO VALPROICO)",
    categoria: "Antiepiléptico / Sedante",
    sinonimos: ["depakine", "valproico", "valproato"],
    isoColor: ISO.neuro,
    icono: "🧠",
    vias: ["oral", "iv"],
    modos: ["carga_mantenimiento"],
    fuente: "SEUP / Pediamécum",
    carga: {
      descripcion: "Estatus epiléptico",
      dosis_mg_kg: 30,
      tiempo_min: 5,
      via: "IV en 3-5 min sin diluir (o diluido en SSF/SG5%)",
      nota: "Carga 20-40 mg/kg en 3-5 min (máx. 3 g). Tercera o cuarta línea en estatus, tras benzodiacepinas y levetiracetam/fenitoína. Mantenimiento: 1-5 mg/kg/h en perfusión continua, o transición a vía oral a 20-40 mg/kg/día divididos. Niveles diana 50-100 mg/L."
    },
    intermitente: [
      {
        indicacion: "Mantenimiento antiepiléptico (oral)",
        via: "oral",
        dosis_mg_kg_dia: 20,
        intervalo_h: 12,
        dosis_max_dia_mg: 2500,
        nota: "Iniciar 10-15 mg/kg/día y subir 5-10 mg/kg cada 3-7 días hasta 20-40 mg/kg/día. Eficaz en epilepsias generalizadas idiopáticas, ausencias, mioclonias.",
        preparados: [
          { nombre: "Depakine solución 200 mg/ml", conc_mg_ml: 200 },
          { nombre: "Depakine comp. 200 / 500 mg", conc_mg_ml: null },
          { nombre: "Depakine crono 300 / 500 mg", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Epilepsias generalizadas idiopáticas (ausencias, mioclónica juvenil)",
        "Epilepsias focales (alternativa)",
        "Estatus epiléptico (tercera línea)",
        "Profilaxis de migraña (en adolescentes)"
      ],
      contraindicaciones: [
        "Hepatopatía activa o antecedente de hepatopatía grave (especialmente en < 2 años)",
        "Trastornos del ciclo de la urea",
        "Porfiria",
        "Embarazo (teratogénico — evitar en mujeres adolescentes en edad fértil)",
        "Trastornos mitocondriales conocidos"
      ],
      precauciones: [
        "Hepatotoxicidad grave especialmente en < 2 años, polifarmacia o enfermedad metabólica — vigilar transaminasas",
        "Pancreatitis aguda (rara pero grave)",
        "Trombocitopenia, ganancia ponderal, alopecia, temblor",
        "Hiperamoniemia (vigilar si sintomatología confusional)"
      ]
    }
  },

  {
    nombre: "VANCOMICINA",
    categoria: "Antibiótico",
    sinonimos: ["vancomicina"],
    isoColor: ISO.antibiotico,
    icono: "💉",
    vias: ["iv", "oral"],
    modos: ["intermitente"],
    fuente: "Pediamécum / SEUP",
    intermitente: [
      {
        indicacion: "Infección grave por gram + resistente (SARM, MRCNS)",
        via: "iv",
        dosis_mg_kg: 15,
        intervalo_h: 6,
        dosis_max_mg: 1000,
        nota: "60 mg/kg/día divididos cada 6 h. En meningitis: 60-80 mg/kg/día. Monitorizar niveles valle (objetivo 10-20 mg/L; 15-20 en infecciones graves). Administrar en 60 min (más lento si > 1 g)."
      },
      {
        indicacion: "Colitis pseudomembranosa (oral)",
        via: "oral",
        dosis_mg_kg: 10,
        intervalo_h: 6,
        dosis_max_mg: 125,
        duracion: "10 días",
        nota: "40 mg/kg/día divididos en 4 dosis (máx. 500 mg/día). Indicado en C. difficile recurrente o grave. La forma IV no es eficaz para esta indicación."
      }
    ],
    info: {
      indicaciones: [
        "Infecciones graves por SARM",
        "Sepsis neonatal tardía (con cobertura gramnegativa)",
        "Meningitis empírica (en asociación)",
        "Colitis por C. difficile (vía oral)"
      ],
      contraindicaciones: [
        "Hipersensibilidad a vancomicina"
      ],
      precauciones: [
        "Síndrome del hombre rojo (red man) por infusión rápida — administrar en > 60 min",
        "Nefrotoxicidad y ototoxicidad (dependientes de dosis y duración)",
        "Monitorización de niveles y función renal",
        "Ajuste en insuficiencia renal"
      ]
    }
  },

  {
    nombre: "VASELINA / EMOLIENTES",
    categoria: "Dermatología",
    sinonimos: ["vaselina", "emoliente", "emolientes", "lipikar", "atopiclair", "cetaphil", "eucerin", "avene trixera", "lutsine", "exomega", "stelatopia", "bepanthol sensiderm", "lipikar baume"],
    isoColor: ISO.neutral,
    icono: "🧴",
    vias: ["top"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP) / Consenso AEDV",
    intermitente: [
      {
        indicacion: "Mantenimiento de piel atópica / Xerosis / Profilaxis de brotes",
        via: "top",
        dosis_fija_mg: 0,
        intervalo_h: 8,
        duracion: "Crónica (a largo plazo, mantenimiento permanente)",
        nota: "**Base del tratamiento de la dermatitis atópica**. Aplicar generosamente sobre toda la superficie de piel seca, **al menos 2-3 veces al día**, especialmente tras el baño con la piel todavía húmeda (técnica «soak & seal»). Usar **150-200 g/semana en lactantes** y **250-500 g/semana en niños mayores** para que sea eficaz. Sin restricción de edad: utilizable desde el periodo neonatal. Reduce la frecuencia y severidad de los brotes, mejora la función barrera cutánea, disminuye la necesidad de corticoides tópicos y ahorra antihistamínicos. **Tipos**: pomada (oclusión máxima, piel muy seca o liquenificada), bálsamo (intermedio), crema (uso diurno, mejor cosmética), loción (zonas extensas, verano). Los **emolientes con activos** (ceramidas, glicerol, urea pediátrica al 5-10%, omega 6) son superiores a la vaselina pura en piel atópica. La **vaselina pura** sigue siendo válida y económica.",
        preparados: [
          { nombre: "Vaselina filante pura (fórmula magistral)", conc_mg_ml: null },
          { nombre: "Lipikar Baume AP+ (La Roche-Posay)", conc_mg_ml: null },
          { nombre: "Atopiclair crema (no esteroideo)", conc_mg_ml: null },
          { nombre: "Eucerin AtopiControl", conc_mg_ml: null },
          { nombre: "Avène Trixera+", conc_mg_ml: null },
          { nombre: "Lutsine Stelatopia (Mustela)", conc_mg_ml: null },
          { nombre: "Aveeno Skin Relief (avena coloidal)", conc_mg_ml: null },
          { nombre: "Bepanthol Sensiderm crema", conc_mg_ml: null }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Dermatitis atópica — base del tratamiento (todas las edades, todas las gravedades)",
        "Xerosis cutánea (piel seca constitucional)",
        "Prevención de brotes de eccema",
        "Piel sensible o reactiva tras tratamiento con corticoides tópicos",
        "Profilaxis de irritación cutánea (frío, viento, agua dura, baño frecuente)",
        "Cuidados de la piel neonatal (uso liberal)"
      ],
      contraindicaciones: [
        "Hipersensibilidad a alguno de los excipientes (revisar formulación si hay dermatitis alérgica)",
        "Heridas infectadas o lesiones exudativas francas: tratar primero, después emoliente"
      ],
      precauciones: [
        "**Cantidad importa**: 250-500 g/semana en niños — la mayoría de los fallos terapéuticos en atopía se deben a uso insuficiente",
        "Aplicar tras el baño (15 min) sobre piel ligeramente húmeda para mayor eficacia",
        "Evitar fragancias y conservantes potencialmente sensibilizantes en piel atópica (revisar composición)",
        "La vaselina pura puede manchar la ropa: usar formulaciones cosméticas para el día",
        "En brote activo: combinar con corticoide tópico — primero corticoide, esperar 15-30 min, después emoliente"
      ]
    }
  },

  {
    nombre: "VASOPRESINA",
    categoria: "Reanimación / UCIP",
    sinonimos: ["vasopresina", "adh", "arginina vasopresina"],
    isoColor: ISO.cardio,
    icono: "💉",
    vias: ["iv", "io"],
    modos: ["perfusion"],
    fuente: "Pediamécum (AEP) / UCIP",
    presentaciones: [
      {
        label: "20 UI / 50 ml SG5% (concentración estándar UCIP)",
        dosis_mg: 20, dilucion_ml: 50, suero: "Dx5%",
        concMgMl: 20 / 50,                       // 0,4 UI/ml (UI tratadas como mg)
        dosisRange: "0,0003 – 0,002 UI/kg/min",
        dosisMin: 0.0003, softMax: 0.002, hardMax: 0.003,
        unidad: "UI/kg/min", calcTipo: "mg_kg_min"
      }
    ],
    info: {
      indicaciones: [
        "Shock séptico refractario a noradrenalina (coadyuvante vasopresor de segunda línea)",
        "Shock vasodilatador postcirugía cardíaca (vasoplejia post-CEC)",
        "Diabetes insípida central (uso en bolus o perfusión)",
        "Hemorragia digestiva por varices esofagogástricas (uso seleccionado)",
        "Parada cardíaca refractaria (uso anecdótico)"
      ],
      contraindicaciones: [
        "Hipovolemia no corregida",
        "Cardiopatía isquémica grave",
        "Vasoconstricción periférica grave preexistente"
      ],
      precauciones: [
        "**Vía central obligatoria** — riesgo de necrosis isquémica grave por extravasación o uso en vía periférica",
        "Vasoconstricción periférica, mesentérica y coronaria intensa: vigilar perfusión periférica, diuresis y enzimas cardíacas",
        "Hiponatremia con uso prolongado (efecto antidiurético)",
        "Trombocitopenia leve, alteraciones de la coagulación",
        "Iniciar a dosis baja y titular cuidadosamente; el rango terapéutico es estrecho",
        "En shock séptico pediátrico, las guías más recientes (Surviving Sepsis Pediatric 2020) la incluyen como segunda línea tras noradrenalina; en algunos protocolos solo se reserva a casos refractarios"
      ]
    }
  },

  {
    nombre: "VITAMINA D",
    categoria: "Endocrino",
    sinonimos: ["vitamina d", "colecalciferol", "vitamina d3", "calcifediol", "hidroferol"],
    isoColor: ISO.endocrino,
    icono: "☀️",
    vias: ["oral", "im"],
    modos: ["intermitente"],
    fuente: "Pediamécum / AEP",
    intermitente: [
      {
        indicacion: "Profilaxis del raquitismo (universal en < 1 año)",
        via: "oral",
        dosis_fija_mg: 0.01,
        intervalo_h: 24,
        nota: "400 UI/día en TODOS los lactantes durante el primer año de vida (1 mcg = 40 UI; 400 UI = 10 mcg). Continuar 400-600 UI/día en niños y adolescentes con escasa exposición solar o ingesta dietética inadecuada. Prematuros: 400-800 UI/día.",
        preparados: [
          { nombre: "Vitamina D3 Kern Pharma 2000 UI/ml (1 gota ≈ 66 UI)", conc_mg_ml: 0.05 },
          { nombre: "Deltius / Hidroferol gotas (varias concentraciones)", conc_mg_ml: null },
          { nombre: "Vitamina D3 (colecalciferol) 1000 UI/cápsula", conc_mg_ml: null }
        ]
      },
      {
        indicacion: "Tratamiento de déficit de vitamina D",
        via: "oral",
        dosis_fija_mg: 0.05,
        intervalo_h: 24,
        nota: "Lactantes < 1 año: 2000 UI/día × 6-12 sem, después 400 UI/día mantenimiento. 1-18 años: 2000-4000 UI/día × 6-12 sem, después 600-1000 UI/día. Alternativa: dosis única alta (stoss) 50.000 UI en > 1 año bajo supervisión. Monitorizar 25-OH-vit D, calcio, fósforo y PTH."
      },
      {
        indicacion: "Calcifediol (Hidroferol) — formulación equivalente",
        via: "oral",
        dosis_fija_mg: 0.266,
        intervalo_h: 720,
        nota: "Hidroferol 0,266 mg (= 16.000 UI de calcifediol) bisemanal o quincenal según pauta. Activa más rápidamente que colecalciferol en hepatopatía o malabsorción. Adolescentes y adultos.",
        preparados: [
          { nombre: "Hidroferol ampolla bebible 0,266 mg (calcifediol)", conc_mg_ml: null },
          { nombre: "Hidroferol gotas 0,1 mg/ml", conc_mg_ml: 0.1 }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Profilaxis universal del raquitismo en < 1 año (recomendación AEP)",
        "Profilaxis en niños con escasa exposición solar, piel oscura, obesidad, antiepilépticos crónicos",
        "Tratamiento del déficit confirmado (25-OH-vit D < 20 ng/ml)",
        "Raquitismo carencial",
        "Hipocalcemia por hipoparatiroidismo (con calcitriol)"
      ],
      contraindicaciones: [
        "Hipercalcemia",
        "Hipervitaminosis D",
        "Síndromes de hipersensibilidad a vitamina D"
      ],
      precauciones: [
        "Sobredosis crónica: hipercalcemia, hipercalciuria, nefrocalcinosis",
        "Vigilar calcemia en tratamientos a dosis altas",
        "Las formulaciones comerciales tienen concentraciones muy variables: leer prospecto detenidamente",
        "El cálculo en mg suele ser confuso — pensar siempre en UI"
      ]
    }
  },

  {
    nombre: "VITAMINA K (FITOMENADIONA)",
    categoria: "Neonatos",
    sinonimos: ["vitamina k", "fitomenadiona", "konakion"],
    isoColor: ISO.neonatal,
    icono: "👶",
    vias: ["im", "oral", "iv"],
    modos: ["puntual", "intermitente"],
    fuente: "AEP / Neofax",
    puntual: {
      descripcion: "Profilaxis de la enfermedad hemorrágica del RN",
      dosis_fija_mg: 1,
      via: "IM única al nacimiento, en la cara anterolateral del muslo",
      nota: "Dosis IM única recomendada: 1 mg en RN ≥ 1500 g; 0,5 mg en < 1500 g. Pauta oral alternativa (cuando se rechaza IM): 2 mg al nacer, 2 mg a la semana y 2 mg al mes (durante lactancia materna). Iniciar siempre en las primeras horas de vida."
    },
    intermitente: [
      {
        indicacion: "Sangrado por antagonismo vitamina K (warfarina) / déficit",
        via: "iv",
        dosis_mg_kg: 0.3,
        intervalo_h: 24,
        dosis_max_mg: 10,
        nota: "Sangrado activo: 0,3 mg/kg IV lenta (máx. 10 mg) en 30 min. INR alto sin sangrado: 0,03 mg/kg oral o IV. Repetir según INR. Evitar bolo rápido IV (anafilactoides).",
        preparados: [
          { nombre: "Konakion ampolla 2 mg/0,2 ml (10 mg/ml) — uso IM/IV/oral", conc_mg_ml: 10 },
          { nombre: "Konakion ampolla 10 mg/ml", conc_mg_ml: 10 }
        ]
      }
    ],
    info: {
      indicaciones: [
        "Profilaxis de enfermedad hemorrágica del recién nacido (universal)",
        "Sangrado o anticoagulación excesiva por antagonistas vit K",
        "Déficit de vitamina K por malabsorción, atresia biliar, fibrosis quística",
        "Hipoprotrombinemia neonatal"
      ],
      contraindicaciones: [
        "Hipersensibilidad al excipiente (raro)"
      ],
      precauciones: [
        "Reacciones anafilactoides con administración IV rápida — administrar lenta",
        "Sin contraindicación en lactancia materna",
        "Hiperbilirrubinemia con dosis altas en neonatos (especialmente prematuros)"
      ]
    }
  },

  // ── Z ─────────────────────────────────────────────────────
  {
    nombre: "ZINC ORAL",
    categoria: "Digestivo",
    sinonimos: ["zinc", "sulfato de zinc", "acetato de zinc", "zinc sulfato"],
    isoColor: ISO.digestivo,
    icono: "💊",
    vias: ["oral"],
    modos: ["intermitente"],
    fuente: "Pediamécum (AEP) / OMS",
    intermitente: [
      {
        indicacion: "Diarrea aguda en < 5 años (coadyuvante, recomendación OMS)",
        via: "oral",
        dosis_fija_mg: 20,
        intervalo_h: 24,
        duracion: "10-14 días",
        nota: "Dosis expresada en zinc elemental. **< 6 meses: 10 mg/día; ≥ 6 meses: 20 mg/día** durante 10-14 días. Recomendación OMS/UNICEF junto con SRO en la diarrea aguda del menor de 5 años: reduce la duración y la gravedad del episodio y previene recurrencias en los meses siguientes. Mayor impacto demostrado en países de renta baja y en niños con riesgo de déficit de zinc; en países desarrollados con buen estado nutricional el beneficio es menor.",
        preparados: [
          { nombre: "Sulfato de zinc solución / sobres (fórmula magistral o registrada)", conc_mg_ml: null },
          { nombre: "Acetato de zinc comprimidos (Wilzin — uso en enf. de Wilson)", conc_mg_ml: null }
        ]
      },
      {
        indicacion: "Acrodermatitis enteropática / déficit de zinc",
        via: "oral",
        dosis_mg_kg_dia: 1,
        intervalo_h: 24,
        nota: "Acrodermatitis enteropática (déficit congénito): 1-3 mg/kg/día de zinc elemental de mantenimiento. Déficit adquirido (nutrición parenteral prolongada, malabsorción, fibrosis quística): suplementar según niveles. Monitorizar zinc y cobre séricos en tratamientos prolongados (el zinc reduce la absorción de cobre)."
      }
    ],
    info: {
      indicaciones: [
        "Diarrea aguda en < 5 años (coadyuvante de la rehidratación, OMS)",
        "Acrodermatitis enteropática (déficit congénito de zinc)",
        "Déficit de zinc adquirido (malabsorción, NP prolongada, fibrosis quística)",
        "Enfermedad de Wilson (acetato de zinc, uso especializado)"
      ],
      contraindicaciones: [
        "Hipersensibilidad a las sales de zinc"
      ],
      precauciones: [
        "Náuseas y molestias gástricas (tomar con algo de alimento si hay intolerancia, aunque en ayunas se absorbe mejor)",
        "El uso prolongado reduce la absorción de cobre: vigilar cobre sérico",
        "Separar de la toma de hierro y de antibióticos (quinolonas, tetraciclinas): interfiere su absorción",
        "El beneficio en diarrea es mayor en poblaciones con riesgo de déficit"
      ]
    }
  }

];

// Categorías únicas para filtrado
const categorias = [...new Set(farmacos.map(f => f.categoria))].sort();
