// Master list of every editable piece of content on the site.
// Each entry becomes one field in the admin panel automatically.
// type: "text" | "textarea" | "image"
// "default" = the current placeholder value already live on the site,
// shown pre-filled in the admin panel so you're editing, not starting blank.

const CONTENT_FIELDS = [
  // ---------- GLOBAL ----------
  { key: "site_phone", label: "Phone Number 1 (shown everywhere)", type: "text", group: "Global — Contact Info", default: "+91 99999 99999" },
  { key: "site_phone_2", label: "Phone Number 2", type: "text", group: "Global — Contact Info", default: "+91 98888 88888" },
  { key: "site_phone_3", label: "Phone Number 3", type: "text", group: "Global — Contact Info", default: "+91 97777 77777" },
  { key: "site_email_admissions", label: "Admissions Email", type: "text", group: "Global — Contact Info", default: "admissions@pvminternationalacademy.com" },
  { key: "site_email_general", label: "General Email", type: "text", group: "Global — Contact Info", default: "info@pvminternationalacademy.com" },
  { key: "site_address", label: "School Address", type: "textarea", group: "Global — Contact Info", default: "[Your School Address], Bengaluru, Karnataka, India" },
  { key: "footer_blurb", label: "Footer Description Text", type: "textarea", group: "Global — Contact Info", default: "A CBSE-aligned school for Pre-KG through Grade 10, built around academics, character and a genuinely global outlook." },
  { key: "social_facebook_url", label: "Facebook Page URL", type: "text", group: "Global — Contact Info", default: "https://facebook.com" },
  { key: "social_instagram_url", label: "Instagram Profile URL", type: "text", group: "Global — Contact Info", default: "https://instagram.com" },
  { key: "social_whatsapp_url", label: "WhatsApp Link (e.g. https://wa.me/919999999999)", type: "text", group: "Global — Contact Info", default: "https://wa.me/919999999999" },
  { key: "social_whatsapp_url_2", label: "Second WhatsApp Link", type: "text", group: "Global — Contact Info", default: "https://wa.me/919999999999" },

  // ---------- HOME — HERO ----------
  { key: "home_hero_video", label: "Hero Background Video (URL)", type: "image", group: "Home — Hero", default: "" },
  { key: "home_hero_title_line1", label: "Hero Title — Line 1", type: "text", group: "Home — Hero", default: "Grounded in values." },
  { key: "home_hero_title_line2", label: "Hero Title — Line 2 (highlighted)", type: "text", group: "Home — Hero", default: "Ready for the world." },
  { key: "home_hero_subtitle", label: "Hero Subtitle", type: "textarea", group: "Home — Hero", default: "PVM International Academy blends a rigorous CBSE-aligned curriculum with a genuinely global outlook — small classes, real mentorship, and a campus built for how children actually learn." },
  { key: "home_stat_years", label: "Stat: Years of Excellence", type: "text", group: "Home — Hero", default: "15" },
  { key: "home_stat_faculty", label: "Stat: Expert Faculty", type: "text", group: "Home — Hero", default: "60" },
  { key: "home_stat_students", label: "Stat: Students", type: "text", group: "Home — Hero", default: "1200" },
  { key: "home_stat_countries", label: "Stat: Countries Represented", type: "text", group: "Home — Hero", default: "12" },

  // ---------- HOME — ABOUT TEASER ----------
  { key: "home_about_heading", label: "About Teaser — Heading", type: "text", group: "Home — About Teaser", default: "A school that takes childhood as seriously as achievement" },
  { key: "home_about_text", label: "About Teaser — Paragraph", type: "textarea", group: "Home — About Teaser", default: "Every classroom at PVM is designed around the same question: what does this child need to thrive, ten years from now?" },
  { key: "home_about_image", label: "About Teaser — Photo", type: "image", group: "Home — About Teaser", default: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80" },

  // ---------- HOME — PROGRAM CARDS ----------
  { key: "home_prog1_image", label: "Program Card 1 — Photo (Early Years)", type: "image", group: "Home — Program Cards", default: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80" },
  { key: "home_prog1_title", label: "Program Card 1 — Title", type: "text", group: "Home — Program Cards", default: "Early Years" },
  { key: "home_prog1_desc", label: "Program Card 1 — Description", type: "textarea", group: "Home — Program Cards", default: "Play-based learning that builds language, motor skills and curiosity." },
  { key: "home_prog2_image", label: "Program Card 2 — Photo (Primary)", type: "image", group: "Home — Program Cards", default: "https://images.unsplash.com/photo-1573497491765-dccce02b29df?w=500&q=80" },
  { key: "home_prog2_title", label: "Program Card 2 — Title", type: "text", group: "Home — Program Cards", default: "Primary School" },
  { key: "home_prog2_desc", label: "Program Card 2 — Description", type: "textarea", group: "Home — Program Cards", default: "Strong fundamentals in literacy, numeracy and inquiry-based science." },
  { key: "home_prog3_image", label: "Program Card 3 — Photo (Middle)", type: "image", group: "Home — Program Cards", default: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&q=80" },
  { key: "home_prog3_title", label: "Program Card 3 — Title", type: "text", group: "Home — Program Cards", default: "Middle School" },
  { key: "home_prog3_desc", label: "Program Card 3 — Description", type: "textarea", group: "Home — Program Cards", default: "Subject specialisation begins, alongside sport, art and design labs." },
  { key: "home_prog4_image", label: "Program Card 4 — Photo (Secondary)", type: "image", group: "Home — Program Cards", default: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=500&q=80" },
  { key: "home_prog4_title", label: "Program Card 4 — Title", type: "text", group: "Home — Program Cards", default: "Secondary School" },
  { key: "home_prog4_desc", label: "Program Card 4 — Description", type: "textarea", group: "Home — Program Cards", default: "Focused board-exam preparation with dedicated mentoring through Grade 10." },

  // ---------- HOME — WHY US ----------
  { key: "home_why1_title", label: "Why Us Card 1 — Title", type: "text", group: "Home — Why Choose Us", default: "Low student-teacher ratio" },
  { key: "home_why1_desc", label: "Why Us Card 1 — Description", type: "textarea", group: "Home — Why Choose Us", default: "Capped at 1:18, so no child is a face in the crowd." },
  { key: "home_why2_title", label: "Why Us Card 2 — Title", type: "text", group: "Home — Why Choose Us", default: "Global exposure" },
  { key: "home_why2_desc", label: "Why Us Card 2 — Description", type: "textarea", group: "Home — Why Choose Us", default: "Exchange programs, Model UN, and an international pen-pal network." },
  { key: "home_why3_title", label: "Why Us Card 3 — Title", type: "text", group: "Home — Why Choose Us", default: "Beyond the classroom" },
  { key: "home_why3_desc", label: "Why Us Card 3 — Description", type: "textarea", group: "Home — Why Choose Us", default: "40+ clubs spanning robotics, debate, music and competitive sport." },

  // ---------- ABOUT PAGE ----------
  { key: "about_founded_year", label: "Year Founded", type: "text", group: "About Page", default: "2010" },
  { key: "about_campus_photo", label: "Overview — Campus Photo", type: "image", group: "About Page", default: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80" },
  { key: "about_founder_photo", label: "Chairman Photo", type: "image", group: "About Page", default: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=700&q=80" },
  { key: "about_founder_name", label: "Chairman Name", type: "text", group: "About Page", default: "[Chairman's Name]" },
  { key: "about_founder_quote", label: "Chairman Quote", type: "textarea", group: "About Page", default: "I started PVM because I believed Bengaluru needed a school where academic ambition and genuine care for each child could exist in the same building." },
  { key: "about_principal_photo", label: "Academy Head Photo", type: "image", group: "About Page", default: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=700&q=80" },
  { key: "about_principal_name", label: "Academy Head Name", type: "text", group: "About Page", default: "[Academy Head's Name]" },
  { key: "about_principal_quote", label: "Academy Head Quote", type: "textarea", group: "About Page", default: "Every child who walks through our gates deserves teachers who notice them." },
  { key: "about_secretary_photo", label: "Secretary Photo", type: "image", group: "About Page", default: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=700&q=80" },
  { key: "about_secretary_name", label: "Secretary Name", type: "text", group: "About Page", default: "[Secretary's Name]" },
  { key: "about_secretary_quote", label: "Secretary Quote", type: "textarea", group: "About Page", default: "A short message from the Secretary about the academy." },
  { key: "about_director_photo", label: "Director Photo", type: "image", group: "About Page", default: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&q=80" },
  { key: "about_director_name", label: "Director Name", type: "text", group: "About Page", default: "[Director's Name]" },
  { key: "about_director_quote", label: "Director Quote", type: "textarea", group: "About Page", default: "A short message from the Director about the academy." },

  // ---------- ACADEMICS PAGE ----------
  { key: "academics_early_years_desc", label: "Early Years — Description", type: "textarea", group: "Academics Page", default: "Play-based, sensory-rich learning that develops language, motor skills, and early social confidence." },
  { key: "academics_primary_desc", label: "Primary School — Description", type: "textarea", group: "Academics Page", default: "Core literacy and numeracy taught alongside EVS, art and inquiry-based science." },
  { key: "academics_middle_desc", label: "Middle School — Description", type: "textarea", group: "Academics Page", default: "Subjects specialise, computer science and a second language are introduced." },
  { key: "academics_secondary_desc", label: "Secondary School — Description", type: "textarea", group: "Academics Page", default: "Focused board-exam preparation across all core subjects, backed by dedicated mentoring." },

  // ---------- CAMPUS LIFE PAGE ----------
  { key: "campus_infra_image", label: "Infrastructure — Photo", type: "image", group: "Campus Life Page", default: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&q=80" },
  { key: "campus_infra_desc", label: "Infrastructure — Description", type: "textarea", group: "Campus Life Page", default: "Spacious classrooms, wide corridors and a safe, well-maintained campus." },
  { key: "campus_library_image", label: "Library — Photo", type: "image", group: "Campus Life Page", default: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=500&q=80" },
  { key: "campus_library_desc", label: "Library — Description", type: "textarea", group: "Campus Life Page", default: "A growing collection across fiction, reference and periodicals, with a quiet reading room." },
  { key: "campus_transport_image", label: "Transport — Photo", type: "image", group: "Campus Life Page", default: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&q=80" },
  { key: "campus_transport_desc", label: "Transport — Description", type: "textarea", group: "Campus Life Page", default: "GPS-tracked school buses covering major routes across the city." },
  { key: "campus_scilab_image", label: "Science Lab — Photo", type: "image", group: "Campus Life Page", default: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&q=80" },
  { key: "campus_scilab_desc", label: "Science Lab — Description", type: "textarea", group: "Campus Life Page", default: "Fully equipped physics, chemistry and biology labs for hands-on learning." },
  { key: "campus_complab_image", label: "Computer Lab — Photo", type: "image", group: "Campus Life Page", default: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&q=80" },
  { key: "campus_complab_desc", label: "Computer Lab — Description", type: "textarea", group: "Campus Life Page", default: "Modern systems supporting computer science and coding classes." },
  { key: "campus_playground_image", label: "Playground — Photo", type: "image", group: "Campus Life Page", default: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500&q=80" },
  { key: "campus_playground_desc", label: "Playground — Description", type: "textarea", group: "Campus Life Page", default: "Open grounds for athletics, football and everyday outdoor play." },

  // ---------- FACULTY PAGE (legacy fixed fields — replaced by dynamic Faculty tab) ----------
  { key: "faculty_principal_photo", label: "(Legacy) Principal Photo", type: "image", group: "Faculty Page (legacy)", default: "" },
  { key: "faculty_principal_name", label: "(Legacy) Principal Name", type: "text", group: "Faculty Page (legacy)", default: "" },

  // ---------- STAGE PAGES ----------
  { key: "stage_ey_hero_image", label: "Early Years — Hero Photo", type: "image", group: "Stage Pages — Early Years", default: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80" },
  { key: "stage_ey_intro", label: "Early Years — Intro Paragraph", type: "textarea", group: "Stage Pages — Early Years", default: "Our Early Years program (Pre-KG & KG) is built around play-based, sensory-rich learning." },
  { key: "stage_ey_highlight1_title", label: "Early Years — Highlight 1 Title", type: "text", group: "Stage Pages — Early Years", default: "Play-Based Learning" },
  { key: "stage_ey_highlight1_desc", label: "Early Years — Highlight 1 Description", type: "textarea", group: "Stage Pages — Early Years", default: "Structured play that builds language, coordination and curiosity." },
  { key: "stage_ey_highlight2_title", label: "Early Years — Highlight 2 Title", type: "text", group: "Stage Pages — Early Years", default: "Social Confidence" },
  { key: "stage_ey_highlight2_desc", label: "Early Years — Highlight 2 Description", type: "textarea", group: "Stage Pages — Early Years", default: "Circle time and group activities build early social skills." },
  { key: "stage_ey_highlight3_title", label: "Early Years — Highlight 3 Title", type: "text", group: "Stage Pages — Early Years", default: "Caring Teachers" },
  { key: "stage_ey_highlight3_desc", label: "Early Years — Highlight 3 Description", type: "textarea", group: "Stage Pages — Early Years", default: "Low ratios so every child gets individual attention." },

  { key: "stage_primary_hero_image", label: "Primary School — Hero Photo", type: "image", group: "Stage Pages — Primary School", default: "https://images.unsplash.com/photo-1573497491765-dccce02b29df?w=1200&q=80" },
  { key: "stage_primary_intro", label: "Primary School — Intro Paragraph", type: "textarea", group: "Stage Pages — Primary School", default: "Grades 1–5 build strong fundamentals in literacy, numeracy and science." },
  { key: "stage_primary_highlight1_title", label: "Primary — Highlight 1 Title", type: "text", group: "Stage Pages — Primary School", default: "Strong Fundamentals" },
  { key: "stage_primary_highlight1_desc", label: "Primary — Highlight 1 Description", type: "textarea", group: "Stage Pages — Primary School", default: "Literacy and numeracy taught with real-world context." },
  { key: "stage_primary_highlight2_title", label: "Primary — Highlight 2 Title", type: "text", group: "Stage Pages — Primary School", default: "Inquiry-Based Science" },
  { key: "stage_primary_highlight2_desc", label: "Primary — Highlight 2 Description", type: "textarea", group: "Stage Pages — Primary School", default: "Hands-on experiments that build curiosity, not memorisation." },
  { key: "stage_primary_highlight3_title", label: "Primary — Highlight 3 Title", type: "text", group: "Stage Pages — Primary School", default: "Continuous Assessment" },
  { key: "stage_primary_highlight3_desc", label: "Primary — Highlight 3 Description", type: "textarea", group: "Stage Pages — Primary School", default: "Regular feedback instead of one big exam." },

  { key: "stage_middle_hero_image", label: "Middle School — Hero Photo", type: "image", group: "Stage Pages — Middle School", default: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80" },
  { key: "stage_middle_intro", label: "Middle School — Intro Paragraph", type: "textarea", group: "Stage Pages — Middle School", default: "Grades 6–8 introduce subject specialisation, computer science, and a second language." },
  { key: "stage_middle_highlight1_title", label: "Middle — Highlight 1 Title", type: "text", group: "Stage Pages — Middle School", default: "Subject Specialisation" },
  { key: "stage_middle_highlight1_desc", label: "Middle — Highlight 1 Description", type: "textarea", group: "Stage Pages — Middle School", default: "Dedicated subject teachers for each core discipline." },
  { key: "stage_middle_highlight2_title", label: "Middle — Highlight 2 Title", type: "text", group: "Stage Pages — Middle School", default: "Electives Begin" },
  { key: "stage_middle_highlight2_desc", label: "Middle — Highlight 2 Description", type: "textarea", group: "Stage Pages — Middle School", default: "Robotics, art or music — students pick their first electives." },
  { key: "stage_middle_highlight3_title", label: "Middle — Highlight 3 Title", type: "text", group: "Stage Pages — Middle School", default: "Second Language" },
  { key: "stage_middle_highlight3_desc", label: "Middle — Highlight 3 Description", type: "textarea", group: "Stage Pages — Middle School", default: "A second language is introduced alongside core subjects." },

  { key: "stage_secondary_hero_image", label: "Secondary School — Hero Photo", type: "image", group: "Stage Pages — Secondary School", default: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80" },
  { key: "stage_secondary_intro", label: "Secondary School — Intro Paragraph", type: "textarea", group: "Stage Pages — Secondary School", default: "Grades 9–10 focus on rigorous board-exam preparation across all core subjects." },
  { key: "stage_secondary_highlight1_title", label: "Secondary — Highlight 1 Title", type: "text", group: "Stage Pages — Secondary School", default: "Board Exam Focus" },
  { key: "stage_secondary_highlight1_desc", label: "Secondary — Highlight 1 Description", type: "textarea", group: "Stage Pages — Secondary School", default: "Structured preparation for Grade 10 board examinations." },
  { key: "stage_secondary_highlight2_title", label: "Secondary — Highlight 2 Title", type: "text", group: "Stage Pages — Secondary School", default: "Dedicated Mentoring" },
  { key: "stage_secondary_highlight2_desc", label: "Secondary — Highlight 2 Description", type: "textarea", group: "Stage Pages — Secondary School", default: "One-on-one academic mentoring for every student." },
  { key: "stage_secondary_highlight3_title", label: "Secondary — Highlight 3 Title", type: "text", group: "Stage Pages — Secondary School", default: "Career Guidance" },
  { key: "stage_secondary_highlight3_desc", label: "Secondary — Highlight 3 Description", type: "textarea", group: "Stage Pages — Secondary School", default: "Early guidance on stream and career choices ahead." },

  // ---------- MANDATORY PUBLIC DISCLOSURE ----------
  { key: "disclosure_school_name", label: "Name of the School", type: "text", group: "Mandatory Disclosure — General Info", default: "PVM International Academy" },
  { key: "disclosure_affiliation_no", label: "Affiliation No.", type: "text", group: "Mandatory Disclosure — General Info", default: "[Affiliation Number]" },
  { key: "disclosure_school_code", label: "School Code", type: "text", group: "Mandatory Disclosure — General Info", default: "[School Code]" },
  { key: "disclosure_address", label: "Complete Address with Pin Code", type: "textarea", group: "Mandatory Disclosure — General Info", default: "[Your School Address], Bengaluru, Karnataka — 560XXX" },
  { key: "disclosure_principal_name", label: "Principal Name & Qualification", type: "text", group: "Mandatory Disclosure — General Info", default: "[Principal's Name], [Qualification]" },
  { key: "disclosure_email", label: "School Email ID", type: "text", group: "Mandatory Disclosure — General Info", default: "info@pvminternationalacademy.com" },
  { key: "disclosure_phone1", label: "Contact Number 1", type: "text", group: "Mandatory Disclosure — General Info", default: "+91 99999 99999" },
  { key: "disclosure_phone2", label: "Contact Number 2", type: "text", group: "Mandatory Disclosure — General Info", default: "+91 98888 88888" },

  { key: "disclosure_doc_affiliation_letter", label: "Copy of Affiliation Letter (PDF)", type: "image", group: "Mandatory Disclosure — Documents", default: "" },
  { key: "disclosure_doc_trust_deed", label: "Copy of Trust Deed (PDF)", type: "image", group: "Mandatory Disclosure — Documents", default: "" },
  { key: "disclosure_doc_noc", label: "No Objection Certificate / NOC (PDF)", type: "image", group: "Mandatory Disclosure — Documents", default: "" },
  { key: "disclosure_doc_recognition_cert", label: "Copy of Recognition Certificate (PDF)", type: "image", group: "Mandatory Disclosure — Documents", default: "" },
  { key: "disclosure_doc_building_safety", label: "Building Safety Certificate (PDF)", type: "image", group: "Mandatory Disclosure — Documents", default: "" },
  { key: "disclosure_doc_fire_safety", label: "Fire Safety Certificate (PDF)", type: "image", group: "Mandatory Disclosure — Documents", default: "" },
  { key: "disclosure_doc_water_health_sanitation", label: "Water, Health & Sanitation Certificates (PDF)", type: "image", group: "Mandatory Disclosure — Documents", default: "" },
  { key: "disclosure_doc_land_cert", label: "Land Certificates (PDF)", type: "image", group: "Mandatory Disclosure — Documents", default: "" },
  { key: "disclosure_doc_self_declaration", label: "Self Declaration (PDF)", type: "image", group: "Mandatory Disclosure — Documents", default: "" },

  { key: "disclosure_doc_fee_structure", label: "Fee Structure (PDF)", type: "image", group: "Mandatory Disclosure — Academics", default: "" },
  { key: "disclosure_doc_academic_calendar", label: "Annual Academic Calendar (PDF)", type: "image", group: "Mandatory Disclosure — Academics", default: "" },
  { key: "disclosure_doc_smc_list", label: "List of School Management Committee (PDF)", type: "image", group: "Mandatory Disclosure — Academics", default: "" },
  { key: "disclosure_doc_pta_list", label: "List of Parents Teachers Association (PDF)", type: "image", group: "Mandatory Disclosure — Academics", default: "" },
  { key: "disclosure_doc_board_results", label: "Last 3-Year Board Exam Results (PDF)", type: "image", group: "Mandatory Disclosure — Academics", default: "" },

  { key: "disclosure_campus_area", label: "Total Campus Area (Sq Mt)", type: "text", group: "Mandatory Disclosure — Infrastructure", default: "[Area] Sq Mt" },
  { key: "disclosure_classrooms", label: "No. & Size of Classrooms", type: "textarea", group: "Mandatory Disclosure — Infrastructure", default: "[Number] classrooms — [Size] Sq Mt each" },
  { key: "disclosure_labs", label: "No. & Size of Labs (incl. Computer Labs)", type: "textarea", group: "Mandatory Disclosure — Infrastructure", default: "[Number] labs — [Size] Sq Mt each" },
  { key: "disclosure_internet", label: "Internet Facility", type: "text", group: "Mandatory Disclosure — Infrastructure", default: "Yes" },
  { key: "disclosure_girls_toilets", label: "No. of Girls Toilets", type: "text", group: "Mandatory Disclosure — Infrastructure", default: "[Number]" },
  { key: "disclosure_boys_toilets", label: "No. of Boys Toilets", type: "text", group: "Mandatory Disclosure — Infrastructure", default: "[Number]" },
  { key: "disclosure_youtube_link", label: "YouTube Video Link (School Infrastructure Tour)", type: "text", group: "Mandatory Disclosure — Infrastructure", default: "" },
];