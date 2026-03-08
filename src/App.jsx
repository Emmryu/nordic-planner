import { useState } from "react";

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const M = {
  font: "'Georgia', serif",
  mono: "'Courier New', monospace",
  bg: "#080d18",
  card: { background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"9px", padding:"14px" },
  label: { fontSize:"9px", letterSpacing:"3px", textTransform:"uppercase", fontFamily:"'Courier New',monospace", color:"#475569" },
  muted: { color:"#64748b" },
  blue: "#60a5fa",
  green: "#4ade80",
  amber: "#f59e0b",
  orange: "#fb923c",
  red: "#f87171",
  purple: "#a78bfa",
};
const typeColor = { base:"#60a5fa", addon:"#fb923c", extension:"#a78bfa", sidetrip:"#94a3b8" };
const typeLabel = { base:"Base City", addon:"Add-On", extension:"Extension", sidetrip:"Side Trip" };
const tagColor = { food:"#f59e0b", culture:"#60a5fa", kids:"#4ade80", nature:"#34d399" };

// ─── TRANSPORT DATA ───────────────────────────────────────────────────────────
const TRANSPORT = {
  "SMF-CPH":{ from:"Sacramento",to:"Copenhagen",options:[{mode:"✈️ Flight",rec:true,dur:"13–16 hrs total",cost:"$650–950/pp · ~60K UA miles RT",op:"United via SFO+EWR or LHR",tip:"SFO departure preferred — more nonstop options. Morning SFO→EWR + afternoon EWR→CPH = arrive next morning well-rested. Book 8–10 weeks out."}]},
  "SMF-STO":{ from:"Sacramento",to:"Stockholm",options:[{mode:"✈️ Flight",rec:false,dur:"14–17 hrs total",cost:"$700–1,000/pp",op:"SAS via EWR nonstop to ARN",tip:"SAS flies EWR→ARN nonstop (9hrs). Only choose this if making Stockholm your arrival city."}]},
  "CPH-GOT":{ from:"Copenhagen",to:"Gothenburg",options:[{mode:"🚂 Train",rec:true,dur:"3 hrs",cost:"$30–70/pp · sj.se",op:"SJ/DSB via Malmö",tip:"Hourly departures from Copenhagen Central. Scenic — crosses the Øresund Bridge then up the Swedish west coast."}]},
  "CPH-STO":{ from:"Copenhagen",to:"Stockholm",options:[
    {mode:"🚂 Train",rec:true,dur:"4.5–5 hrs",cost:"$40–90/pp · sj.se",op:"SJ/DSB Øresund + X2000",tip:"Departs every 1–2 hrs. A 9am departure arrives by 2pm. Crosses the Øresund Bridge — kids love it. Reserve a 4-seat table compartment."},
    {mode:"✈️ Flight",rec:false,dur:"1 hr + airport = ~3.5 hrs door-to-door",cost:"$80–200/pp",op:"SAS / Norwegian",tip:"Airport overhead negates the speed. Train is better in every way on this route."},
  ]},
  "CPH-MAL":{ from:"Copenhagen",to:"Malmö",options:[{mode:"🚂 Train",rec:true,dur:"35 min",cost:"$12–25/pp",op:"Øresundståg",tip:"Runs every 20 min. No planning needed. Great half-day side trip."}]},
  "GOT-STO":{ from:"Gothenburg",to:"Stockholm",options:[{mode:"🚂 Train",rec:true,dur:"3 hrs",cost:"$30–80/pp · sj.se",op:"SJ X2000",tip:"Hourly. Reserve a 4-person table section. Sweden's best intercity train — fast, smooth, reliable."}]},
  "STO-HEL":{ from:"Stockholm",to:"Helsinki",options:[
    {mode:"⛴️ Overnight Ferry",rec:true,dur:"17 hrs overnight",cost:"$80–180 total for 4-berth cabin · vikingline.com",op:"Viking Line or Tallink Silja",tip:"Departs Stockholm ~5:30pm, arrives Helsinki ~10am. BOOK A CABIN — do not do this in seats with kids. Ship has kids' playrooms, buffet dinner, duty-free shop. This is a trip highlight. Book 4–6 weeks ahead — fills completely in summer."},
    {mode:"✈️ Flight",rec:false,dur:"1 hr + airport = ~3.5 hrs",cost:"$80–180/pp",op:"SAS / Finnair",tip:"Misses the ferry entirely. Only use if schedule forces it."},
  ]},
  "HEL-TAL":{ from:"Helsinki",to:"Tallinn",options:[{mode:"⛴️ Fast Ferry",rec:true,dur:"2–2.5 hrs",cost:"$25–45/pp · tallinksilja.com",op:"Tallink Silja or Eckerö Line",tip:"Runs every ~2 hrs, 7am–9pm. No advance booking needed. Fast catamaran. Arrive 30 min early at West Harbour. Easiest international crossing of the trip."}]},
  "TAL-RIG":{ from:"Tallinn",to:"Riga",options:[
    {mode:"🚌 Bus",rec:true,dur:"4.5 hrs",cost:"$15–35/pp · lux-express.com",op:"Lux Express (premium) or FlixBus",tip:"Lux Express is worth the few extra euros — comfortable seats, WiFi, café service. Multiple daily departures from Tallinn bus station. Arrives Riga central. Book ahead for best prices."},
    {mode:"✈️ Flight",rec:false,dur:"1 hr + airports = ~3.5 hrs",cost:"$60–150/pp",op:"airBaltic",tip:"Slower door-to-door than the bus. Not recommended."},
  ]},
  "RIG-VIL":{ from:"Riga",to:"Vilnius",options:[{mode:"🚌 Bus",rec:true,dur:"4 hrs",cost:"$12–30/pp · lux-express.com",op:"Lux Express",tip:"Most convenient option. Hourly-ish departures. Central Riga to central Vilnius."}]},
  "HEL-OSL":{ from:"Helsinki",to:"Oslo",options:[{mode:"✈️ Flight",rec:true,dur:"2 hrs",cost:"$100–220/pp",op:"Finnair / SAS",tip:"Direct flights multiple times daily. Book 4–6 weeks out."}]},
  "HEL-BER":{ from:"Helsinki",to:"Bergen",options:[{mode:"✈️ Flight via Oslo",rec:true,dur:"3–4 hrs with connection",cost:"$150–280/pp",op:"SAS or Finnair via OSL",tip:"No direct. HEL→OSL (1.5hrs) + OSL→BGO (45min). Allow 2hrs connection in Oslo. Book as separate tickets — can be cheaper."}]},
  "TAL-OSL":{ from:"Tallinn",to:"Oslo",options:[{mode:"✈️ Flight",rec:true,dur:"2 hrs",cost:"$60–150/pp · norwegian.com",op:"Norwegian Air / SAS",tip:"Norwegian Air usually cheapest ($60–90pp booked 4–6 weeks out). Check in online — Norwegian charges at airport."}]},
  "OSL-BER":{ from:"Oslo",to:"Bergen",options:[
    {mode:"🚂 Train",rec:true,dur:"7 hrs",cost:"$40–90/pp · vy.no",op:"Vy — Bergensbanen",tip:"One of the world's great rail journeys. Take the 8:25am departure — arrives 3:57pm. DO NOT take an evening train. Pack snacks and download content for kids. Myrdal section is the most dramatic. Book the family carriage if available."},
    {mode:"✈️ Flight",rec:false,dur:"1 hr",cost:"$60–150/pp",op:"SAS / Norwegian",tip:"Only if schedule is extremely tight on the final day before flying home. Misses the entire journey."},
  ]},
  "BER-FLA":{ from:"Bergen",to:"Flåm",options:[
    {mode:"🚂 Train + Flåmbana",rec:true,dur:"4–5 hrs scenic",cost:"$60–100/pp · norwaynutshell.com",op:"Vy / Fjord Tours (Norway in a Nutshell)",tip:"Bergen→Voss (1hr) → Voss→Myrdal (1.5hrs) → Myrdal→Flåm on Flåmbana (1hr). Morning ~8:25am departure gets you to Flåm by 1pm. Book on norwaynutshell.com."},
    {mode:"🚌 Express Bus",rec:false,dur:"2.5 hrs",cost:"$25–35/pp",op:"Skyss",tip:"Faster and cheaper but misses the scenic rail experience. Fine for the return leg."},
  ]},
  "FLA-OSL":{ from:"Flåm",to:"Oslo",options:[{mode:"🚂 Flåmbana + Bergensbanen",rec:true,dur:"5.5 hrs",cost:"$50–90/pp · vy.no",op:"Vy",tip:"Flåm→Myrdal (1hr) → Myrdal→Oslo (4.5hrs). The reverse of the Oslo→Bergen scenic journey. Morning departure."}]},
  "BER-ALE":{ from:"Bergen",to:"Ålesund",options:[
    {mode:"✈️ Flight",rec:true,dur:"45 min",cost:"$60–130/pp",op:"SAS / Widerøe",tip:"Multiple daily. Widerøe is often cheaper — Norway's regional carrier."},
    {mode:"⛴️ Hurtigruten coastal ferry",rec:false,dur:"~21 hrs overnight",cost:"$150–400/pp",op:"Hurtigruten",tip:"Spectacular coastal scenery but extremely long as a transfer. Better as a dedicated experience."},
  ]},
  "OSL-LOF":{ from:"Oslo",to:"Lofoten",options:[{mode:"✈️ Flight",rec:true,dur:"2–2.5 hrs",cost:"$120–250/pp",op:"SAS via Bodø or direct to SVJ",tip:"SAS flies OSL→SVJ (Svolvær) direct in summer. Otherwise OSL→BOO then Widerøe to Lofoten. Book early — summer peak season."}]},
  "OSL-TRO":{ from:"Oslo",to:"Tromsø",options:[{mode:"✈️ Flight",rec:true,dur:"2 hrs",cost:"$100–220/pp",op:"SAS / Norwegian",tip:"Direct flights from Oslo. Tromsø is above the Arctic Circle. Midnight sun in late June. Gateway to northern lights in winter (not relevant for your trip dates)."}]},
  "RIG-OSL":{ from:"Riga",to:"Oslo",options:[{mode:"✈️ Flight",rec:true,dur:"2.5 hrs",cost:"$80–180/pp",op:"airBaltic / SAS",tip:"airBaltic flies RIG→OSL multiple times daily, often the cheapest. SAS is also an option. Book 4–6 weeks out for best prices. Riga Airport is compact and easy."}]},
  "BER-SMF":{ from:"Bergen",to:"Sacramento",options:[{mode:"✈️ Flight",rec:true,dur:"13–16 hrs",cost:"$750–1,050/pp",op:"BA via LHR or KLM via AMS",tip:"BGO→LHR (2hrs) then LHR→SFO (10.5hrs). Or AMS connection via KLM. Aim for 10am+ Bergen departure."}]},
  "OSL-SMF":{ from:"Oslo",to:"Sacramento",options:[{mode:"✈️ Flight",rec:true,dur:"12–15 hrs",cost:"$700–1,000/pp",op:"SAS/United via EWR or LHR",tip:"SAS flies OSL→EWR nonstop (9hrs) — best option. Connect SFO/SMF. Morning Oslo departure → afternoon EWR→SFO."}]},
};

// ─── DESTINATIONS ─────────────────────────────────────────────────────────────
const DESTINATIONS = [
  // ── DENMARK ──
  {
    id:"cph", city:"Copenhagen", country:"Denmark", flag:"🇩🇰", region:"denmark",
    type:"base", idealNights:"3–4", cost:5, kidScore:5, foodScore:5, cultureScore:5, offPathScore:3, photoScore:5,
    tags:["Food City","Architecture","Design","Walkable"],
    summary:"The best food city in Scandinavia. Noma's legacy has seeded dozens of world-class restaurants across every price point. Dense, walkable, extraordinarily kid-friendly. Your arrival city and first major food moment.",
    highlights:[
      {name:"Torvehallerne Market",type:"food",note:"Best food hall in Scandinavia — two glass halls, 60+ stalls. Smørrebrød, fresh pastries, organic juice. Go mid-morning before the lunch crowd."},
      {name:"Reffen Street Food Market",type:"food",note:"Open-air container market on the harbor, 50+ independent vendors. Less touristy than Torvehallerne, better for a casual evening. Strong photography."},
      {name:"Nørrebro neighborhood",type:"culture",note:"Local, immigrant food scene, independent cafes. Jægersborggade street is all small restaurants and coffee. Feels nothing like tourist Copenhagen."},
      {name:"Freetown Christiania",type:"culture",note:"Self-governing commune, 50 years old, completely unique. Kids are fine here. Explore DIY architecture, craft stalls, the lake. Skip the main drag."},
      {name:"Tivoli Gardens",type:"kids",note:"World's second-oldest amusement park. Genuinely beautiful at night. Kids this age love it — rides scaled for both 5 and 7 year olds, magical lighting after dark. Pricey but worth one evening."},
      {name:"Meatpacking District (Kødbyen)",type:"food",note:"Former slaughterhouse turned restaurant/bar district. Best evening scene in Copenhagen. Local crowd, zero tourist infrastructure."},
      {name:"GoBoat canal rental",type:"kids",note:"Self-drive electric boats — no license needed. Kids love steering. Nyhavn backdrop for photos. Book at goboat.dk."},
      {name:"Designmuseum Danmark",type:"culture",note:"World-class Danish design collection. Furniture and product design floors are visually engaging even for kids. 1.5 hrs max."},
    ],
    sideTrips:[
      {name:"Roskilde Viking Ship Museum",time:"25 min by train",note:"5 actual 1,000-year-old Viking ships pulled from the fjord. Best kid day trip in Denmark and legitimately interesting for adults. Half-day."},
      {name:"Louisiana Museum of Modern Art",time:"35 min by train",note:"One of the world's great modern art museums. Sculpture gardens on the sea. Strong half-day."},
      {name:"Helsingør — Kronborg Castle",time:"45 min by train",note:"Shakespeare's Hamlet castle, dramatically positioned on the strait. Good with kids. Half-day."},
      {name:"Malmö, Sweden",time:"35 min by train",note:"Cross the iconic Øresund Bridge. Old town, Middle Eastern food in Möllevången neighborhood. Easy half-day from Copenhagen."},
    ],
    cookingClass:"Kokkeskolen Copenhagen — market tour + Nordic cooking class. Kid-friendly options available. ~$150/person.",
    splurge:"Kadeau (1 Michelin, New Nordic) or Geranium (3 stars, park views). Both require months of advance booking.",
    transportKeys:["SMF-CPH","CPH-GOT","CPH-STO","CPH-MAL"],
    hotels:{
      marriott:[
        {name:"W Copenhagen",tier:"Luxury",points:"50K/night — USE FNA HERE",note:"Best single FNA use on the trip. Cash rate $400–500+. Cat 6–7."},
        {name:"Copenhagen Marriott Hotel",tier:"Upper Upscale",points:"40K/night",note:"Solid harbor-adjacent location. Free breakfast with status."},
      ],
      alt:[
        {name:"Hotel Sanders",tier:"Boutique Luxury",price:"$300–450/night",note:"Former ballet dancer's townhouse. 54 rooms. Top independent pick in Copenhagen."},
        {name:"Nimb Hotel",tier:"Luxury",price:"$350–550/night",note:"Inside Tivoli Gardens. Extraordinary for 1–2 nights if splurging."},
        {name:"Wakeup Copenhagen",tier:"Budget",price:"$90–140/night",note:"Best budget option with actual Scandinavian design sensibility."},
        {name:"Airbnb: Nørrebro or Frederiksberg",tier:"Apartment",price:"$180–280/night",note:"Better for 3+ nights. Space, kitchen, neighborhood feel."},
      ]
    }
  },
  {
    id:"mal", city:"Malmö", country:"Sweden", flag:"🇸🇪", region:"sweden",
    type:"sidetrip", idealNights:"0 (day trip)", cost:3, kidScore:3, foodScore:4, cultureScore:3, offPathScore:4, photoScore:3,
    tags:["Day Trip from CPH","Øresund Bridge","Middle Eastern Food","Old Town"],
    summary:"35 minutes from Copenhagen by train across the iconic Øresund Bridge. Sweden's third city has a strong immigrant food scene in Möllevången, a charming medieval old town, and a completely different urban feel from the Danish capital. Easy half-day with kids.",
    highlights:[
      {name:"Øresund Bridge crossing",type:"culture",note:"The 8km bridge/tunnel crossing is genuinely dramatic — kids find it fascinating. Views of the strait and the two cities."},
      {name:"Gamla Staden (Old Town)",type:"culture",note:"Medieval cobblestone streets, market square (Stortorget), historic buildings. More compact and less touristy than Gamla Stan in Stockholm."},
      {name:"Möllevångstorget neighborhood",type:"food",note:"Malmö's immigrant quarter — best falafel, kebab, and Middle Eastern food in Scandinavia. Very authentic. Cheap and excellent."},
      {name:"Lilla Torg square",type:"culture",note:"Pretty 16th-century square with restaurants and bars. More pleasant than the main tourist areas."},
    ],
    sideTrips:[],
    cookingClass:null,
    splurge:"Vollmers (2 Michelin stars) — one of the best restaurants in Scandinavia, right here in Malmö.",
    transportKeys:["CPH-MAL"],
    hotels:{ marriott:[], alt:[{name:"Master Johan Hotel",tier:"Boutique",price:"$140–200/night",note:"Best boutique option in Malmö's old town. Only worth staying if you want to explore Sweden vs. treating as a day trip from CPH."}] }
  },

  // ── SWEDEN ──
  {
    id:"got", city:"Gothenburg", country:"Sweden", flag:"🇸🇪", region:"sweden",
    type:"addon", idealNights:"1–2", cost:4, kidScore:5, foodScore:5, cultureScore:3, offPathScore:4, photoScore:3,
    tags:["Food City","Seafood","Liseberg","Train Stopover"],
    summary:"Sweden's second city and a serious food destination — more seafood-focused and industrial than Stockholm. Liseberg is Scandinavia's largest theme park — the strongest kid-reset card between Copenhagen and Stockholm. Best as a 1-night train stopover.",
    highlights:[
      {name:"Feskekôrka (Fish Church)",type:"food",note:"Gothic Revival fish market shaped like a church. Best fresh shrimp in Sweden. Go mid-morning."},
      {name:"Haga neighborhood",type:"culture",note:"19th-century wooden houses, cobblestone, independent cafes. Famous for giant cinnamon rolls. Photogenic and local."},
      {name:"Liseberg Amusement Park",type:"kids",note:"Scandinavia's largest theme park. Pure kids' day. Strong reset card before Stockholm."},
      {name:"Stora Saluhallen market",type:"food",note:"1889 market hall, 40+ vendors. More working-class feel than Stockholm's Östermalm. Good for lunch."},
    ],
    sideTrips:[{name:"Marstrand island fortress",time:"1 hr by bus + ferry",note:"Car-free island, fortress to climb, good seafood. Half-day."}],
    cookingClass:"Gothenburg Seafood cooking — Swedish west coast traditions. ~$120/person.",
    splurge:"Koka (1 Michelin) or Bhoga (1 Michelin, seasonal Nordic-fusion).",
    transportKeys:["CPH-GOT","GOT-STO"],
    hotels:{
      marriott:[{name:"Gothia Towers (Autograph Collection)",tier:"Upper Upscale",points:"40K/night",note:"Adjacent to Liseberg. Massive hotel, good breakfast, very convenient."}],
      alt:[
        {name:"Upper House",tier:"Design Luxury",price:"$280–420/night",note:"Floors 18–20 of Gothia Towers. Spa, infinity pool, city views. Separate boutique experience."},
        {name:"Pigalle Hotel",tier:"Boutique",price:"$180–260/night",note:"1920s cinema conversion, film-themed, great Haga location."},
      ]
    }
  },
  {
    id:"sto", city:"Stockholm", country:"Sweden", flag:"🇸🇪", region:"sweden",
    type:"base", idealNights:"3–4", cost:5, kidScore:5, foodScore:4, cultureScore:5, offPathScore:3, photoScore:5,
    tags:["Archipelago","Museums","Midsommar","Design"],
    summary:"Built across 14 islands. The K+A Family meetup anchor. Midsommar falls June 20–21 — right on your window, and Skansen does the city's best public Midsommar celebration. Gamla Stan is the postcard; Södermalm and Östermalm are where real Stockholm lives.",
    highlights:[
      {name:"Södermalm neighborhood",type:"culture",note:"Stockholm's creative island. Hornstull market, vintage shops, independent restaurants. Genuinely local — the neighborhood feels lived-in."},
      {name:"Östermalm Food Hall (Saluhallen)",type:"food",note:"Stunning 1889 market hall. Smoked reindeer, gravlax, Nordic cheese. More curated than Torvehallerne, more beautiful space."},
      {name:"Djurgården + Skansen open-air museum",type:"kids",note:"Entire island for museums and parks. Skansen: 160+ historic buildings, Nordic animals — kids' highlight of Stockholm. Walk or take the ferry from Slussen."},
      {name:"Vasa Museum",type:"culture",note:"17th-century warship raised intact after 333 years on the seafloor. One of the best museums in Europe, full stop. 2–3 hrs."},
      {name:"Midsommar at Skansen — June 20–21",type:"culture",note:"Maypole dancing, folk music, traditional food. Genuinely special with kids. One of the best cultural moments of the whole trip."},
      {name:"Archipelago ferry to Vaxholm",type:"kids",note:"Waxholmsbolaget ferry — half-day to Vaxholm island for lunch, wooden painted houses, fortress. Kids love being on the water."},
      {name:"Fotografiska photography museum",type:"culture",note:"World-class rotating exhibitions in converted customs house. Strong restaurant. 2 hrs."},
      {name:"Gamla Stan at 7am",type:"culture",note:"Extremely touristy by 9am, magical before it. Stortorget square, Nobel Museum, Stockholm Cathedral. Walk it but don't linger."},
    ],
    sideTrips:[
      {name:"Vaxholm",time:"1 hr by ferry",note:"Prettiest town in the inner archipelago. Wooden houses, fortress, seafood lunch. Half or full day."},
      {name:"Drottningholm Palace",time:"1 hr by boat",note:"UNESCO royal palace, still inhabited. The boat through Lake Mälaren is the experience. Half-day."},
      {name:"Uppsala",time:"40 min by train",note:"Sweden's oldest university city. Cathedral, Viking burial mounds, botanical gardens. Half-day cultural detour."},
    ],
    cookingClass:"Smaka på Stockholm — Swedish classic dishes, 3-hour format, kids can participate. ~$130/person.",
    splurge:"Frantzén (3 Michelin stars, book months ahead) or Oaxen Krog (2 stars, on a boat).",
    transportKeys:["SMF-STO","CPH-STO","GOT-STO","STO-HEL"],
    hotels:{
      marriott:[
        {name:"Sheraton Stockholm Hotel",tier:"Upper Upscale",points:"45K/night",note:"Best Marriott in Stockholm. Free breakfast with status. Central, island views."},
        {name:"Le Méridien Stockholm",tier:"Upper Upscale",points:"40K/night",note:"Near Central Station. Convenient location."},
      ],
      alt:[
        {name:"At Six",tier:"Design Hotel",price:"$280–420/night",note:"Best independent hotel. Art collection throughout, excellent bar, Norrmalm location."},
        {name:"Hotel Skeppsholmen",tier:"Boutique",price:"$200–300/night",note:"On its own island between Gamla Stan and Djurgården. Converted 18th-century naval building."},
        {name:"Miss Clara by Nobis",tier:"Boutique",price:"$220–350/night",note:"Former girls' school conversion. Stunning architecture near Stureplan."},
        {name:"Airbnb: Södermalm",tier:"Apartment",price:"$200–300/night",note:"Best for family apartment. Space, local feel, walking distance to everything."},
      ]
    }
  },
  {
    id:"upp", city:"Uppsala", country:"Sweden", flag:"🇸🇪", region:"sweden",
    type:"sidetrip", idealNights:"0 (day trip)", cost:2, kidScore:3, foodScore:3, cultureScore:4, offPathScore:3, photoScore:3,
    tags:["Day Trip from Stockholm","University City","Viking Burial Mounds","Cathedral"],
    summary:"Sweden's oldest university city, 40 minutes from Stockholm. The largest cathedral in Scandinavia, Gamla Uppsala with genuine Viking-age burial mounds, and a walkable medieval center. Good half-day cultural detour — not flashy but authentically Swedish.",
    highlights:[
      {name:"Uppsala Cathedral",type:"culture",note:"Largest in Scandinavia. Gustav Vasa's tomb is here. Impressive Gothic structure that took 150 years to build."},
      {name:"Gamla Uppsala burial mounds",type:"kids",note:"Three enormous Iron Age burial mounds of ancient Swedish kings. Kids can climb them. Genuinely eerie and atmospheric."},
      {name:"Uppsala Botanical Garden (Linnéträdgården)",type:"culture",note:"Carl Linnaeus's original garden from 1745. Still intact. Peaceful and beautiful."},
    ],
    sideTrips:[],
    cookingClass:null,
    splurge:"Hambergs Fisk — best seafood restaurant in Uppsala.",
    transportKeys:["STO-UPP"],
    hotels:{ marriott:[], alt:[{name:"Clarion Hotel Gillet",tier:"Mid-Range",price:"$140–200/night",note:"Best option if staying overnight, though most people do Uppsala as a day trip from Stockholm."}] }
  },

  // ── FINLAND ──
  {
    id:"hel", city:"Helsinki", country:"Finland", flag:"🇫🇮", region:"finland",
    type:"base", idealNights:"3–4", cost:4, kidScore:4, foodScore:4, cultureScore:4, offPathScore:4, photoScore:4,
    tags:["Design","Sauna Culture","Islands","Finnish-Japanese"],
    summary:"The most underrated food city on the trip. Strong Finnish-Japanese culinary crossover, incredible design tradition, and genuine local life in Kallio and Töölö. Sauna culture is the defining local experience. The Viking Line ferry from Stockholm makes for an extraordinary arrival.",
    highlights:[
      {name:"Old Market Hall (Vanha Kauppahalli)",type:"food",note:"1889 iron market hall, all Finnish producers. Reindeer, elk, Baltic herring, Finnish cheese. Best mid-morning, more local than touristy."},
      {name:"Kallio neighborhood",type:"culture",note:"Helsinki's working-class-turned-creative hub. Best independent restaurants and bars. Very little English tourism — feels real."},
      {name:"Löyly sauna + restaurant",type:"culture",note:"Architect-designed public sauna on the sea. Go in, swim in the Baltic, repeat. Book ahead. Kids welcome. Deeply Finnish."},
      {name:"Suomenlinna sea fortress",type:"kids",note:"UNESCO island fortress, 15-min ferry from Market Square. Kids love the tunnels, cannons, moats. Pack lunch. Half-day."},
      {name:"Allas Sea Pool",type:"kids",note:"Floating pools in the harbor — heated and unheated, sauna raft. Family-friendly, stunning city views. Kids love this."},
      {name:"Temppeliaukio (Rock Church)",type:"culture",note:"Lutheran church cut directly into granite bedrock. Extraordinary acoustics and natural light. 30 min. Unlike anything else."},
      {name:"Design District walk",type:"culture",note:"25-block area of Finnish design studios, galleries, independent restaurants. Arabia and Marimekko flagships here."},
      {name:"Hakaniemi Market Hall",type:"food",note:"Ground floor Finnish produce, upper floor flea market. Less polished than Old Market Hall — more authentic."},
    ],
    sideTrips:[
      {name:"Porvoo — by boat one way",time:"3 hrs by boat / 1 hr by bus",note:"Finland's second-oldest city. Red ochre warehouses on a river. Artisan food scene. Take the boat one way for the fjord approach, bus back."},
      {name:"Nuuksio National Park",time:"1 hr by metro + bus",note:"Finnish wilderness 30km from city center. Forest lakes, hiking, berry picking. Half to full day."},
      {name:"Tallinn ferry",time:"2 hrs by fast ferry",note:"Gateway to the Tallinn add-on. See Tallinn destination for details."},
    ],
    cookingClass:"Helsinki Cooking School — Finnish cuisine with foraged ingredients. Family format available. ~$120/person.",
    splurge:"Olo (2 Michelin stars, Finnish-Nordic) or Demo (long-running tasting menu institution). Book well ahead.",
    transportKeys:["STO-HEL","HEL-TAL","HEL-OSL","HEL-BER"],
    hotels:{
      marriott:[{name:"Helsinki Marriott Hotel",tier:"Upper Upscale",points:"35–40K/night",note:"Good Bonvoy burn. Free breakfast with status. Near Design District and Market Hall."}],
      alt:[
        {name:"Klaus K Hotel",tier:"Design Boutique",price:"$180–280/night",note:"Finnish mythology-themed. Kalevala artwork throughout. Best independent option."},
        {name:"Hotel Haven",tier:"Luxury Boutique",price:"$250–380/night",note:"On the harbor, 77 rooms, exclusive feel. Best location in Helsinki."},
        {name:"Hotel F6",tier:"Boutique",price:"$160–240/night",note:"Former bank building, 28 rooms, excellent Esplanadi location."},
        {name:"Airbnb: Kallio or Töölö",tier:"Apartment",price:"$150–230/night",note:"Töölö = family-friendly/residential. Kallio = more edgy, better for food."},
      ]
    }
  },
  {
    id:"por", city:"Porvoo", country:"Finland", flag:"🇫🇮", region:"finland",
    type:"sidetrip", idealNights:"0–1", cost:3, kidScore:3, foodScore:4, cultureScore:4, offPathScore:4, photoScore:5,
    tags:["Day Trip from Helsinki","Wooden Old Town","River","Artisan Food"],
    summary:"Finland's second-oldest city, 50km east of Helsinki. The red ochre wooden warehouses lining the river are one of the most photogenic scenes in Finland. Strong artisan food scene and a completely quiet pace. Take the boat one way from Helsinki Market Square (seasonal) — the fjord approach is memorable.",
    highlights:[
      {name:"Old Town wooden warehouses",type:"culture",note:"The iconic image of Porvoo — faded red storage sheds along the Porvoonjoki river. Best photographed from the medieval stone bridge looking upstream."},
      {name:"Porvoo Cathedral",type:"culture",note:"15th-century stone church on the hill above the river. The oldest medieval stone church in Finland still in use."},
      {name:"Artisan food shops",type:"food",note:"Small-batch jams, Finnish chocolates, local cheeses, handmade pastries in the old town lanes. Good for gifts and tastings."},
    ],
    sideTrips:[],
    cookingClass:null,
    splurge:"Restaurant Sinne — best fine dining in Porvoo, locally-sourced Finnish ingredients.",
    transportKeys:["HEL-TAL"],
    hotels:{ marriott:[], alt:[{name:"Hotel Sparre",tier:"Boutique",price:"$130–200/night",note:"Charming boutique hotel right in the old town. Worth an overnight if you want the town without day-trip crowds."}] }
  },

  // ── BALTICS ──
  {
    id:"tal", city:"Tallinn", country:"Estonia", flag:"🇪🇪", region:"baltics",
    type:"addon", idealNights:"2", cost:2, kidScore:4, foodScore:4, cultureScore:5, offPathScore:5, photoScore:5,
    tags:["Medieval","Off-Path","Affordable","Street Art"],
    summary:"The surprise move of the trip. 2-hour ferry from Helsinki. Medieval old town is one of Europe's best-preserved, but Telliskivi and Kalamaja are where real Tallinn lives. Everything costs 40% less than the Nordics. Zero tourists in the right neighborhoods.",
    highlights:[
      {name:"Telliskivi Creative City",type:"culture",note:"Old railway workshops converted to creative district. Street art, food trucks, design studios, craft beer. Zero tourists. This is actual Tallinn."},
      {name:"Medieval Old Town at dusk",type:"culture",note:"After 7pm when day-trippers leave. Toompea Hill views. Narrow cobblestone streets, towers, merchant houses — genuinely extraordinary."},
      {name:"Kalamaja neighborhood",type:"culture",note:"Art Nouveau wooden houses in faded pastels. Balti Jaam flea market on Saturday mornings. Põhjala Tap Room for excellent local craft beer."},
      {name:"Medieval tower walk",type:"kids",note:"Climb the towers, walk the city walls. Kiek in de Kök tower has a good history museum. Kids love the battlements."},
      {name:"Viru Bog Boardwalk",type:"nature",note:"45-min drive. Ancient raised bog with wooden boardwalk through eerie landscape. Kids find it fascinating. Unique to this region."},
      {name:"NOA Chef's Hall",type:"food",note:"Cliff-top sea views, modern Estonian tasting menu. Best splurge dinner in Tallinn. Book ahead."},
      {name:"F-Hoone restaurant",type:"food",note:"In Telliskivi. Converted factory, seasonal Estonian food, communal tables. No tourists."},
    ],
    sideTrips:[{name:"Lahemaa National Park",time:"1.5 hrs by car",note:"Estonia's largest national park. Coastal hiking, manor houses, fishing villages. Full day with a rental car."}],
    cookingClass:"Let's Cook Estonia — Estonian cuisine with foraged ingredients. ~$60–80/person.",
    splurge:"NOA Chef's Hall — cliff-top Estonian tasting menu, ~$80–120/person.",
    transportKeys:["HEL-TAL","TAL-RIG","TAL-OSL"],
    hotels:{
      marriott:[],
      alt:[
        {name:"Hotel Telegraaf",tier:"Boutique Luxury",price:"$140–220/night",note:"Former 19th-century telegraph office. Best hotel in Old Town."},
        {name:"Von Stackelberg Hotel",tier:"Boutique",price:"$120–180/night",note:"Historic manor house just outside Old Town. Garden, quiet, great service."},
        {name:"Airbnb: Kalamaja",tier:"Apartment",price:"$80–140/night",note:"Best choice. Charming wooden buildings, excellent value, neighborhood immersion."},
      ]
    }
  },
  {
    id:"rig", city:"Riga", country:"Latvia", flag:"🇱🇻", region:"baltics",
    type:"extension", idealNights:"2", cost:2, kidScore:3, foodScore:4, cultureScore:5, offPathScore:4, photoScore:5,
    tags:["Art Nouveau","Central Market","Baltic Capital","Architecture"],
    summary:"Latvia's capital has the world's largest collection of Art Nouveau architecture — entire streets of extraordinary turn-of-the-century facades. The Central Market in five former Zeppelin hangars is one of Europe's great food markets. Less visited than Tallinn, more architecturally interesting. Add after Tallinn for a 2-city Baltic circuit.",
    highlights:[
      {name:"Alberta iela — Art Nouveau street",type:"culture",note:"The epicenter of Riga's Art Nouveau district. Entire blocks of ornate facades from the early 1900s. Best photographed in morning light. Walk the surrounding streets for 2–3 hours."},
      {name:"Central Market (Centrāltirgus)",type:"food",note:"Five converted WWI Zeppelin hangars, each dedicated to different food categories — meat, fish, produce, dairy, bread. One of Europe's greatest food markets. Photographically extraordinary."},
      {name:"Vecriga (Old Town)",type:"culture",note:"Medieval old town on the Daugava river. House of the Blackheads, Town Hall square, Dome Cathedral. More Baltic-Hanseatic than Tallinn's medieval style."},
      {name:"Kalnciema Quarter",type:"culture",note:"Riga's answer to Telliskivi — wooden Art Nouveau buildings, Saturday market, independent restaurants, local design studios. Much less touristy."},
      {name:"Latvian Open-Air Ethnographic Museum",type:"kids",note:"100+ historic buildings from across Latvia reassembled in a forest outside the city. Folk crafts, horses, traditional food. Half-day."},
    ],
    sideTrips:[{name:"Jūrmala beach resort",time:"30 min by train",note:"Baltic Sea resort town with a 33km white sand beach. Wooden Art Nouveau summer villas. Good for a relaxed half-day."}],
    cookingClass:"Latvia's Culinary studio — traditional Latvian food with market visit. ~$60–80/person.",
    splurge:"Vincents — Riga's best restaurant, modern European with Latvian ingredients. ~$80–120/person.",
    transportKeys:["TAL-RIG","RIG-VIL","RIG-OSL"],
    hotels:{
      marriott:[],
      alt:[
        {name:"Neiburgs Hotel",tier:"Boutique Luxury",price:"$150–240/night",note:"Best hotel in Riga. 1914 Art Nouveau building beautifully restored. Old Town location."},
        {name:"Hotel Bergs",tier:"Boutique",price:"$140–210/night",note:"Residential feel in the Art Nouveau district. Quiet, personal service."},
        {name:"Airbnb: Old Town or Art Nouveau district",tier:"Apartment",price:"$80–140/night",note:"Best value for space in Riga. The Art Nouveau district has beautiful apartments."},
      ]
    }
  },
  {
    id:"vil", city:"Vilnius", country:"Lithuania", flag:"🇱🇹", region:"baltics",
    type:"extension", idealNights:"2", cost:2, kidScore:3, foodScore:4, cultureScore:5, offPathScore:5, photoScore:5,
    tags:["Baroque Old Town","Uzupis Republic","Most Underrated Baltic","Art Scene"],
    summary:"The most underrated city in the Baltics — possibly in all of Europe. The largest medieval old town in Northern Europe, a neighborhood that declared itself an independent republic (Užupis), and an extraordinary contemporary art scene. Costs even less than Riga and Tallinn.",
    highlights:[
      {name:"Užupis — independent republic",type:"culture",note:"A neighborhood that declared independence on April Fools' Day 1997 and has its own constitution (translated into 30 languages on a wall). Artists, cafes, studios. Completely unique."},
      {name:"Baroque Old Town",type:"culture",note:"UNESCO-listed. The largest and most complete surviving medieval old town in Northern Europe. Over 1,500 buildings from the 14th–18th centuries."},
      {name:"Vilnius Street Art",type:"culture",note:"Extraordinary murals throughout the city. The industrial neighborhood of Naujamiestis has the densest concentration. Photo-walk worthy."},
      {name:"Halės Market",type:"food",note:"Vilnius's central market in a 1906 iron hall. Lithuanian street food, pickles, dairy, local honey. Cheapest excellent food of the entire trip."},
    ],
    sideTrips:[{name:"Trakai Island Castle",time:"30 min by bus",note:"A 15th-century castle on an island in a lake — straight out of a fairy tale. Kids absolutely love it. Half-day."}],
    cookingClass:"Vilnius Cooking Studio — Lithuanian cuisine, very affordable. ~$50–70/person.",
    splurge:"Nineteen18 — modern Lithuanian cuisine. Excellent and roughly half the price of Oslo or Copenhagen.",
    transportKeys:["RIG-VIL"],
    hotels:{
      marriott:[],
      alt:[
        {name:"Artagonist Hotel",tier:"Boutique",price:"$120–180/night",note:"Best hotel in Vilnius. Art-focused, old town location, excellent restaurant."},
        {name:"Airbnb: Old Town or Užupis",tier:"Apartment",price:"$60–120/night",note:"Remarkable value — the cheapest destination on the entire trip. Old Town apartments are beautiful."},
      ]
    }
  },

  // ── NORWAY ──
  {
    id:"osl", city:"Oslo", country:"Norway", flag:"🇳🇴", region:"norway",
    type:"base", idealNights:"2–3", cost:5, kidScore:4, foodScore:5, cultureScore:4, offPathScore:3, photoScore:3,
    tags:["Food Scene","Fjord Access","Grünerløkka","Maaemo"],
    summary:"Oslo punches above its size on food — Maaemo is one of the world's top 20 restaurants and the city's independent dining scene in Grünerløkka is excellent. Most expensive city on the trip but the food quality justifies it. The fjord is at the city's edge.",
    highlights:[
      {name:"Grünerløkka neighborhood",type:"food",note:"Oslo's creative neighborhood. Best independent restaurants, Mathallen food hall, coffee culture. Entirely local crowd."},
      {name:"Mathallen Oslo food hall",type:"food",note:"Oslo's best food hall — 30+ Norwegian producers. Much better than the touristy waterfront options."},
      {name:"Vigeland Sculpture Park",type:"kids",note:"212 bronze and granite sculptures. Free, enormous park. Bizarre and fascinating — kids engage more than expected. 2–3 hrs."},
      {name:"Oslofjord island ferries",type:"kids",note:"Ruter public ferries to islands like Hovedøya — use transit card, pack a picnic. Half-day."},
      {name:"Ekeberg Sculpture Park",type:"culture",note:"50+ sculptures in forest above the city. Munch painted The Scream looking over this fjord. City views, almost no tourists."},
      {name:"Grønland neighborhood",type:"food",note:"Immigrant quarter — best kebab, Middle Eastern and South Asian food in Oslo. Cheap and authentic. Strong contrast."},
      {name:"Norsk Folkemuseum",type:"culture",note:"Open-air museum with 160 Norwegian historic buildings. Kids can go inside many. 3–4 hrs. Best in Scandinavia for open-air museums."},
    ],
    sideTrips:[
      {name:"Bygdøy Peninsula — Viking Ship Museum",time:"20 min by ferry",note:"Actual Viking ships + Kon-Tiki Museum. Strong with kids. Half-day."},
      {name:"Tusenfryd amusement park",time:"30 min by bus",note:"Norway's largest theme park. Pure kids' reset day when needed."},
    ],
    cookingClass:"Mathallen Oslo runs cooking workshops. Norwegian seasonal cuisine. ~$100–130/person.",
    splurge:"Maaemo (3 Michelin stars, 20-course, ~$350/person — book 3–6 months ahead) or Arakataka for more accessible splurge.",
    transportKeys:["HEL-OSL","TAL-OSL","OSL-BER","OSL-LOF","OSL-TRO","OSL-SMF"],
    hotels:{
      marriott:[
        {name:"Thon Hotel Opera (Autograph Collection)",tier:"Upper Upscale",points:"45K/night",note:"Best Marriott in Oslo. Next to Opera House, harbor views."},
        {name:"Oslo Marriott Hotel",tier:"Upper Upscale",points:"40K/night",note:"Central Karl Johans gate location. Free breakfast with status."},
      ],
      alt:[
        {name:"The Thief",tier:"Design Luxury",price:"$300–500/night",note:"Oslo's best hotel. Art-filled, its own peninsula by Astrup Fearnley Museum."},
        {name:"Grand Hotel Oslo",tier:"Historic Luxury",price:"$280–450/night",note:"Where Nobel Peace Prize winners stay. Swimming pool. Statement property."},
        {name:"Thon Hotel Rosenkrantz",tier:"Mid-Range",price:"$170–260/night",note:"Best value in Oslo. Breakfast included. Thon is the dominant Norwegian chain."},
        {name:"Airbnb: Grünerløkka or Frogner",tier:"Apartment",price:"$180–280/night",note:"Frogner = upscale/residential. Grünerløkka = better for food access."},
      ]
    }
  },
  {
    id:"ber", city:"Bergen", country:"Norway", flag:"🇳🇴", region:"norway",
    type:"base", idealNights:"2–3", cost:5, kidScore:4, foodScore:4, cultureScore:3, offPathScore:3, photoScore:5,
    tags:["Fjords Gateway","Seafood","Hiking","Photogenic Wharf"],
    summary:"Gateway to Norway's fjords and the most photogenic city on the trip. Best used as a 2–3 night base for the Nærøyfjord day trip and Mt. Fløyen hike. Small city — don't overallocate time here, let the fjords do the heavy lifting.",
    highlights:[
      {name:"Bryggen Wharf at golden hour",type:"culture",note:"UNESCO Hanseatic merchant houses. In late June, golden hour is around 10:30pm. Skip the tourist shops inside — they're disappointing. Photo from the harbor."},
      {name:"Fisketorget Fish Market",type:"food",note:"Legitimate fresh seafood in the morning. Get the mixed platter. Avoid souvenir stalls. Go before 11am."},
      {name:"Mt. Fløyen funicular + hike down",type:"kids",note:"Funicular up (7 min), views over city and fjords, hike back down through forest (45 min). Trolls carved along the trail. Both kids love both directions."},
      {name:"Mathallen Bergen food hall",type:"food",note:"Local food hall — cheesemakers, bakers, fishmongers, butchers. Much less touristy than the fish market."},
      {name:"KODE Art Museums",type:"culture",note:"4 buildings of Norwegian and Nordic art. Edvard Munch and Nikolai Astrup collections. Strong on a rainy day. 2 hrs."},
    ],
    sideTrips:[
      {name:"Nærøyfjord — Norway in a Nutshell",time:"Full day",note:"Bergen→Voss→Flåm by train, then Nærøyfjord cruise Flåm→Gudvangen, then bus back. Book via norwaynutshell.com weeks ahead."},
      {name:"Hardangerfjord — self-drive",time:"2 hrs by rental car",note:"Less visited than Nærøy. Eidfjord village, Vøringsfossen waterfall. Better for independent exploration."},
    ],
    cookingClass:"Bergen Seafood cooking class — Norwegian seafood traditions. ~$100–130/person.",
    splurge:"Lysverket (1 Michelin, in the KODE museum building) or Bare restaurant (seafood, local producers).",
    transportKeys:["HEL-BER","OSL-BER","BER-FLA","BER-ALE","BER-SMF"],
    hotels:{
      marriott:[{name:"Bergen Børs Hotel (Curio Collection)",tier:"Upper Upscale",points:"40K/night",note:"Historic stock exchange right on the harbor. Best Marriott option in Bergen."}],
      alt:[
        {name:"Thon Hotel Bergen Brygge",tier:"Mid-Range",price:"$180–260/night",note:"Waterfront at Bryggen, breakfast included. Best value in Bergen."},
        {name:"Thon Hotel Orion",tier:"Mid-Range",price:"$160–240/night",note:"Reliable Thon quality, central, breakfast included."},
        {name:"Hotel Park Bergen",tier:"Boutique",price:"$170–250/night",note:"Charming villa hotel near the university. Quieter, personal service."},
        {name:"Airbnb: Nordnes neighborhood",tier:"Apartment/Cabin",price:"$160–230/night",note:"Wooden house rentals with harbor views. Good family value."},
      ]
    }
  },
  {
    id:"fla", city:"Flåm + Nærøyfjord", country:"Norway", flag:"⛰️", region:"norway",
    type:"addon", idealNights:"1–2", cost:4, kidScore:5, foodScore:2, cultureScore:2, offPathScore:3, photoScore:5,
    tags:["UNESCO Fjord","Scenic Train","Kayaking","Waterfalls"],
    summary:"The fjord experience proper. Nærøyfjord is the narrowest UNESCO fjord in Europe — walls rising 1,400m with waterfalls dropping directly into the water. Most people day-trip from Bergen; staying overnight puts you there after tourist boats leave. Kayaking at water level is completely different from the boat.",
    highlights:[
      {name:"Nærøyfjord boat cruise",type:"kids",note:"The main event. Flåm→Gudvangen, 2hrs. UNESCO walls so narrow you can almost touch them. Book 2+ weeks ahead at thefjords.com."},
      {name:"Flåmbana Railway",type:"kids",note:"20km, 863m elevation change, steepest standard-gauge railway in the world. Stops at Kjosfossen waterfall — dancing water nymph appears in summer. 1 hr each way."},
      {name:"Fjord kayaking",type:"kids",note:"Njord Expeditions offer guided tours. Kids 5+ can do tandem kayaks. Water-level perspective is incomparably different from the boat. 2–3 hrs. Book with your accommodation."},
      {name:"Viking Valley, Gudvangen",type:"kids",note:"Recreated Viking village at the end of the fjord cruise. Blacksmithing, archery, longhouse. Actually well done. Strong kid reset."},
      {name:"Stegastein viewpoint, Aurland",type:"culture",note:"Cantilevered platform over the fjord. 10 min from Flåm by ferry or short drive. The best single photograph of the trip."},
    ],
    sideTrips:[],
    cookingClass:null,
    splurge:"Flåmsbrygga Hotel restaurant — local trout, lamb, foraged ingredients. Only real dining option in Flåm.",
    transportKeys:["BER-FLA","FLA-OSL"],
    hotels:{
      marriott:[],
      alt:[
        {name:"Flåmsbrygga Hotel",tier:"Boutique",price:"$200–320/night",note:"Right on the fjord dock. Best location. Book very far ahead — fills completely."},
        {name:"Fretheim Hotel",tier:"Historic",price:"$180–280/night",note:"130-year-old hotel, fjord views, classic Norwegian aesthetic."},
        {name:"Airbnb: Flåm or Aurland",tier:"Cabin",price:"$150–250/night",note:"Best for the fjord after day-trippers leave. Evening light is extraordinary."},
      ]
    }
  },
  {
    id:"ale", city:"Ålesund", country:"Norway", flag:"🇳🇴", region:"norway",
    type:"extension", idealNights:"2", cost:4, kidScore:3, foodScore:3, cultureScore:3, offPathScore:5, photoScore:5,
    tags:["Art Nouveau","Less Visited","Photography","Geirangerfjord Gateway"],
    summary:"Norway's most beautiful city that most people skip. Rebuilt entirely in Art Nouveau style after a 1904 fire, on a cluster of islands with fjord views in all directions. Geirangerfjord — arguably the most dramatic fjord in Norway — is 3 hours away. Primarily for photographers and serious Norway enthusiasts.",
    highlights:[
      {name:"Aksla viewpoint",type:"culture",note:"418 steps from the city center. Panoramic view over the Art Nouveau roofscape and surrounding fjords. In late June, spectacular at 11pm in golden/midnight light."},
      {name:"Art Nouveau city walk",type:"culture",note:"The entire city center is a recognized Art Nouveau streetscape. Architecture walk with map from tourist office. 2 hrs."},
      {name:"Atlantic Sea Park (Atlanterhavsparken)",type:"kids",note:"One of Europe's largest aquariums. Kids can touch stingrays and sea anemones. Half-day strong kid activity."},
    ],
    sideTrips:[{name:"Geirangerfjord",time:"3 hrs by ferry from Ålesund",note:"Often called Norway's most beautiful fjord. UNESCO. Seven Sisters and Suitor waterfalls. More dramatic and more crowded than Nærøy. Day trip or overnight in Geiranger village."}],
    cookingClass:null,
    splurge:"XL-Diner — best restaurant in Ålesund. Norwegian coastal cuisine, exceptional seafood.",
    transportKeys:["BER-ALE"],
    hotels:{
      marriott:[],
      alt:[
        {name:"Brosundet Hotel",tier:"Boutique",price:"$180–280/night",note:"Former 1904 warehouse on the water. Fishing boats outside your window. Most atmospheric hotel in Ålesund."},
        {name:"Quality Hotel Waterfront",tier:"Mid-Range",price:"$140–200/night",note:"Best value with views. Nordic Choice Hotels chain."},
      ]
    }
  },
  {
    id:"lof", city:"Lofoten Islands", country:"Norway", flag:"🏔️", region:"norway",
    type:"extension", idealNights:"3–4", cost:4, kidScore:4, foodScore:3, cultureScore:3, offPathScore:5, photoScore:5,
    tags:["Dramatic Scenery","Rorbu Cabins","Midnight Sun","Photography"],
    summary:"The most dramatic landscape in Norway — jagged peaks rising directly from the sea, red fishing cabins on stilts, midnight sun in late June. A significant detour (fly from Oslo, 2hrs) but genuinely one of the most extraordinary places in Europe. Best justified for 3+ nights. The rorbu cabin experience is available nowhere else.",
    highlights:[
      {name:"Reine fishing village",type:"culture",note:"The postcard image of Lofoten. Surrounded by peaks on all sides, red rorbuer on the water. Reinebringen viewpoint hike (steep, 1.5hrs each way) rewards with the most dramatic view."},
      {name:"Henningsvær village",type:"culture",note:"Archipelago village on several islands connected by bridges. Strong arts scene. Kaviar Factory gallery. Good restaurants."},
      {name:"Rorbu cabin stay",type:"culture",note:"Traditional fisherman's cabin on stilts, painted red. The definitive Lofoten experience. Book through Nusfjord Arctic Resort or Airbnb."},
      {name:"Midnight sun",type:"culture",note:"Late June = midnight sun. The light at 11pm is completely extraordinary — golden all night. Disorienting for kids. Bring blackout curtains."},
      {name:"Kayaking between islands",type:"kids",note:"Kayaking through the archipelago in the midnight sun is a genuinely once-in-a-lifetime experience. Multiple operators in Svolvær and Å."},
    ],
    sideTrips:[],
    cookingClass:null,
    splurge:"Børsen Spiseri in Svolvær — fresh Arctic fish, seasonal menu, best restaurant in Lofoten.",
    transportKeys:["OSL-LOF"],
    hotels:{
      marriott:[],
      alt:[
        {name:"Nusfjord Arctic Resort",tier:"Boutique / Historic",price:"$250–400/night",note:"Best curated rorbu experience. Historic cabins, excellent food, organized activities."},
        {name:"Airbnb rorbu cabin",tier:"Unique",price:"$200–350/night",note:"Book directly through Airbnb. This is the Lofoten experience — red cabin, stilts, water below you."},
      ]
    }
  },
  {
    id:"tro", city:"Tromsø", country:"Norway", flag:"🇳🇴", region:"norway",
    type:"extension", idealNights:"2–3", cost:4, kidScore:3, foodScore:3, cultureScore:3, offPathScore:5, photoScore:5,
    tags:["Arctic Circle","Midnight Sun","Northern Lights (winter)","Sami Culture"],
    summary:"Norway's Arctic capital, above the 69th parallel. In late June it's the midnight sun capital — 24 hours of daylight. The northern lights are NOT visible in summer (you need darkness), but the midnight sun hike and Arctic wildlife are unique. More relevant as an addition if you extend into early July. Gateway to Sami culture.",
    highlights:[
      {name:"Midnight sun hike",type:"nature",note:"Hike Storsteinen mountain at midnight in full daylight. One of the most surreal experiences available in late June. Cable car + short walk."},
      {name:"Arctic-Alpine Botanical Garden",type:"culture",note:"World's northernmost botanical garden. Flowering in summer. Free entry. Peaceful."},
      {name:"Polaria Arctic Experience Center",type:"kids",note:"Arctic wildlife exhibits, bearded seals, panoramic Arctic film. Good half-day with kids."},
      {name:"Sami cultural experiences",type:"culture",note:"Several operators offer introductions to Sami reindeer herding and traditional culture. Best booked in advance."},
    ],
    sideTrips:[],
    cookingClass:null,
    splurge:"Emmas Drømmekjøkken — 'Emma's Dream Kitchen', best restaurant in Tromsø, Arctic ingredients.",
    transportKeys:["OSL-TRO"],
    hotels:{
      marriott:[],
      alt:[
        {name:"Clarion Hotel The Edge",tier:"Design",price:"$180–280/night",note:"Best hotel in Tromsø. Floor-to-ceiling windows with fjord views. Good restaurant."},
        {name:"Scandic Ishavshotel",tier:"Mid-Range",price:"$150–230/night",note:"Ship-shaped hotel on the waterfront. Reliable, good location."},
      ]
    }
  },
];

// ─── COUNTRY OVERVIEWS ────────────────────────────────────────────────────────
const COUNTRIES = [
  {
    id:"denmark", name:"Denmark", flag:"🇩🇰",
    tagline:"The food capital of Scandinavia",
    summary:"Denmark punches far above its size on food — Copenhagen is one of the top 5 food cities in the world right now, and Noma's influence has seeded an entire generation of exceptional restaurants. The country is small, extremely walkable, and deeply kid-friendly. Most visitors see only Copenhagen, which is enough for a 3-4 day stop. The day-trip circuit (Roskilde, Louisiana, Helsingør, Malmö) can fill several more days without leaving the city as a base.",
    highlights:["World's best food city (Copenhagen)","Øresund Bridge crossing","Viking Ship Museum in Roskilde","Louisiana Museum of Modern Art","Extremely kid-friendly infrastructure"],
    bestFor:"Food, design, art, family travel",
    season:"June is peak season and ideal — long days, warm, events.",
    destIds:["cph","mal"],
    practicalNotes:"Danish krone (DKK). No visa for US citizens. Extremely English-speaking. Most expensive country in the EU. Tipping not customary but appreciated for excellent service."
  },
  {
    id:"sweden", name:"Sweden", flag:"🇸🇪",
    tagline:"Islands, design, and Midsommar magic",
    summary:"Sweden rewards slow travel — the cities are beautiful but the real Sweden is in the archipelagos, wooden villages, and the train journeys between cities. Stockholm is one of the most beautiful capitals in Europe, Gothenburg is an underrated food city, and the train network is exceptional. Midsommar (June 20–21) is the most Swedish cultural event you can attend — Skansen in Stockholm is the best public celebration.",
    highlights:["Stockholm archipelago","Midsommar at Skansen (Jun 20–21)","SJ train network between cities","Gothenburg food scene + Liseberg","Vasa Museum"],
    bestFor:"Culture, design, family travel, food, trains",
    season:"Late June is perfect — Midsommar, long days, archipelago boats running.",
    destIds:["got","sto","upp","mal"],
    practicalNotes:"Swedish krona (SEK). No visa for US citizens. Very English-speaking. Book SJ trains in advance at sj.se — prices rise dramatically closer to travel date."
  },
  {
    id:"finland", name:"Finland", flag:"🇫🇮",
    tagline:"Saunas, design, and the most underrated food city in Scandinavia",
    summary:"Finland is the quieter, more introverted sibling in the Nordic family — and all the more interesting for it. Helsinki has a design tradition that rivals Copenhagen but a fraction of the international recognition. The Finnish-Japanese culinary crossover (Finnish chefs who trained in Japan bringing precision to local ingredients) produces exceptional restaurants. Sauna culture is not optional — it's the defining social ritual. The Viking Line ferry from Stockholm is one of the best travel experiences of the whole trip.",
    highlights:["Viking Line overnight ferry from Stockholm","Löyly sauna on the sea","Finnish-Japanese restaurant scene","Suomenlinna sea fortress","Porvoo by boat"],
    bestFor:"Food, design, sauna culture, local authenticity",
    season:"Late June = long days (nearly midnight sun). Löyly and Allas Sea Pool at their best.",
    destIds:["hel","por"],
    practicalNotes:"Euro (€). No visa for US citizens. Very English-speaking. Book Viking Line ferry as early as possible — fills in summer. Helsinki Marriott is a good Bonvoy use."
  },
  {
    id:"baltics", name:"Baltic States", flag:"🇪🇪🇱🇻🇱🇹",
    tagline:"Medieval cities, Art Nouveau, and the biggest value on the trip",
    summary:"The Baltic States — Estonia, Latvia, Lithuania — are the most underrated region in Europe and the best value on this trip by far. Everything costs 40-60% less than the Nordics. The cities are extraordinary: Tallinn's medieval old town, Riga's Art Nouveau district (the largest in the world), Vilnius's Baroque old town. You won't see many other American families here. The Tallinn add-on from Helsinki is the most efficient way to add a Baltic country without significant extra travel.",
    highlights:["Tallinn medieval old town (off-tourist-hours)","Telliskivi Creative City — real local Tallinn","Riga Art Nouveau district (world's largest)","Riga Central Market in Zeppelin hangars","Vilnius Užupis independent republic","Trakai Island Castle (kids' highlight)"],
    bestFor:"Off-beaten-path, architecture, food value, photography, culture",
    season:"June is excellent throughout — warm, long days, before peak European summer crowds.",
    destIds:["tal","rig","vil"],
    practicalNotes:"Estonia and Latvia use Euro (€). Lithuania uses Euro (€). No visa for US citizens. Very English-speaking in tourist areas. Lux Express bus is the best intercity transport — book at lux-express.com."
  },
  {
    id:"norway", name:"Norway", flag:"🇳🇴",
    tagline:"The world's most dramatic fjords — and the most expensive country on the trip",
    summary:"Norway delivers the most visually spectacular moments of the entire trip — Nærøyfjord walls rising 1,400m, the Bergensbanen train snaking through snow-capped mountains, red fishing cabins reflected in Lofoten's still water. But this comes at a price: Norway is significantly more expensive than the Nordics, and Marriott Bonvoy coverage is thin outside Oslo. Budget $80–120/person/day above accommodation. The Oslo→Bergen scenic train is a bucket-list journey. The fjords with kids are extraordinary.",
    highlights:["Oslo→Bergen Bergensbanen scenic train (7hrs)","Nærøyfjord — UNESCO, narrowest fjord in Europe","Flåmbana steepest railway + kayaking","Lofoten Islands midnight sun + rorbu cabins","Maaemo restaurant Oslo (world top 20)","Mt. Fløyen hike Bergen"],
    bestFor:"Nature, photography, dramatic scenery, family adventure, food (Oslo)",
    season:"Late June = midnight sun — extraordinary light all night. Peak season means book fjord transport weeks ahead.",
    destIds:["osl","ber","fla","ale","lof","tro"],
    practicalNotes:"Norwegian krone (NOK). No visa for US citizens. Very English-speaking. Thon Hotels is the dominant Norwegian chain (Marriott equivalent) — use for Bergen and Oslo where Bonvoy is weak. Norway in a Nutshell (norwaynutshell.com) is the easiest fjord booking. Vy.no for trains."
  },
];

// ─── ROUTES ───────────────────────────────────────────────────────────────────
const ROUTES = {
  A:{ id:"A", emoji:"🔵", name:"Nordic + Baltic Compact",
    tagline:"CPH → Stockholm → Helsinki → Tallinn → home",
    dates:"Jun 18 – Jul 4", duration:"17 days",
    norway:false, tallinn:true,
    desc:"A smarter take on the simpler loop. Adds Tallinn as a 2-hr ferry from Helsinki — the biggest value-per-surprise on the trip. No Norway, but the Baltic addition gives you a genuinely off-beaten-path city at a fraction of Nordic prices. Lowest complexity of any route that includes Tallinn.",
    stops:[
      {dest:"cph",dates:"Jun 18–20",nights:2,note:"Arrive. Torvehallerne market, Nørrebro, canal boat"},
      {dest:"sto",dates:"Jun 20–24",nights:4,note:"Midsommar Jun 20–21. Gamla Stan, Djurgården, Södermalm",meetup:true},
      {dest:"hel",dates:"Jun 24–28",nights:4,note:"Viking Line ferry from Stockholm. Kallio, sauna, Suomenlinna",meetup:true},
      {dest:"tal",dates:"Jun 28–Jul 1",nights:3,note:"Fast ferry from Helsinki. Telliskivi, Old Town at dusk, Kalamaja"},
      {dest:"cph",dates:"Jul 1–4",nights:3,note:"Fly TAL→CPH. Final meals, Christiania, fly home Jul 4–5"},
    ],
    legs:["SMF-CPH","CPH-STO","STO-HEL","HEL-TAL","BER-SMF"],
    budgetEst:{low:8200,mid:9800,high:13000},
    pros:["Tallinn adds real off-beaten-path depth","Ferry experience included","Lowest complexity route that has Baltic stop","Strong food arc: CPH → STO → HEL → TAL","Most budget-friendly option"],
    cons:["No Norway — fjords completely missed","Revisiting CPH at end adds hotel cost","Tallinn feels slightly rushed at 3 nights"],
  },
  B:{ id:"B", emoji:"🟠", name:"Nordic + Tallinn + Norway",
    tagline:"CPH → Gothenburg → Stockholm → Helsinki → Tallinn → Oslo → Bergen → home",
    dates:"Jun 16 – Jul 4–5", duration:"19–20 days",
    norway:true, tallinn:true,
    desc:"The full picture. Gothenburg as a 1-night train stopover with Liseberg for the kids. Tallinn is a 2-hr ferry add-on from Helsinki. Oslo→Bergen scenic train is the bucket-list rail journey. 6 countries, maximum diversity.",
    stops:[
      {dest:"cph",dates:"Jun 16–18",nights:2,note:"Arrive. Reffen market, Nørrebro"},
      {dest:"got",dates:"Jun 18–19",nights:1,note:"Train stopover. Liseberg + Fish Church"},
      {dest:"sto",dates:"Jun 19–23",nights:4,note:"Midsommar Jun 20–21. Gamla Stan, Skansen, archipelago",meetup:true},
      {dest:"hel",dates:"Jun 23–26",nights:3,note:"Viking Line ferry. Kallio, saunas, Old Market Hall",meetup:true},
      {dest:"tal",dates:"Jun 26–28",nights:2,note:"Fast ferry. Telliskivi, Old Town at dusk"},
      {dest:"osl",dates:"Jun 28–Jul 1",nights:3,note:"Fly TLL→OSL. Grünerløkka, Vigeland, fjord ferries"},
      {dest:"ber",dates:"Jul 1–4",nights:3,note:"Oslo→Bergen scenic train. Nærøyfjord day, Fløyen"},
    ],
    legs:["SMF-CPH","CPH-GOT","GOT-STO","STO-HEL","HEL-TAL","TAL-OSL","OSL-BER","BER-SMF"],
    budgetEst:{low:10500,mid:12400,high:16000},
    pros:["Tallinn off-beaten-path + affordable","Oslo→Bergen train unmissable","6 countries, max diversity","Gothenburg Liseberg = kids' reset","Best overall for your travel style"],
    cons:["Most complex logistics","Cash mid-range slightly over $12K (points bring it under)","Bergen train is 7hrs — needs kid prep"],
  },
  C:{ id:"C", emoji:"🟢", name:"Fjord Focus",
    tagline:"CPH → Stockholm → Helsinki → Bergen → Oslo → home",
    dates:"Jun 18 – Jul 4", duration:"17 days",
    norway:true, tallinn:false,
    desc:"Drops Tallinn, goes deeper into Norway. After the meetup in Helsinki fly to Bergen for Nærøyfjord and Flåm, then the scenic Oslo train home. Best Norway coverage with moderate complexity. Cleanest under-$12K option that includes the fjords.",
    stops:[
      {dest:"cph",dates:"Jun 18–20",nights:2,note:"Arrive. Torvehallerne, Nørrebro, Christiania"},
      {dest:"sto",dates:"Jun 20–23",nights:3,note:"Midsommar, Djurgården, Vasa Museum",meetup:true},
      {dest:"hel",dates:"Jun 23–28",nights:5,note:"Viking Line ferry. Deeper Helsinki time, Porvoo, sauna",meetup:true},
      {dest:"ber",dates:"Jun 28–Jul 1",nights:3,note:"Fly HEL→Bergen. Bryggen, Fløyen, Nærøyfjord day"},
      {dest:"osl",dates:"Jul 1–4",nights:3,note:"Bergen→Oslo scenic train. Grünerløkka, fly home"},
    ],
    legs:["SMF-CPH","CPH-STO","STO-HEL","HEL-BER","OSL-BER","OSL-SMF"],
    budgetEst:{low:9500,mid:11000,high:14000},
    pros:["Best Norway coverage","Oslo→Bergen train included","Under $12K mid-range cash","Clean logical flow"],
    cons:["No Tallinn","Less time in each city","Bergen→Oslo still 7hrs"],
  },
  D:{ id:"D", emoji:"🟣", name:"Baltic Deep Dive",
    tagline:"CPH → Stockholm → Helsinki → Tallinn → Riga → Oslo → home",
    dates:"Jun 16 – Jul 4", duration:"18–19 days",
    norway:true, tallinn:true,
    desc:"Leans hardest into the off-beaten-path instinct. After the meetup in Stockholm and Helsinki, ferry to Tallinn then bus to Riga — two extraordinary cities at 40–60% of Nordic prices. Fly Riga→Oslo for a 3-night Norway cap before heading home. Best fit if Tallinn/Riga architecture and street-level food culture matter more than fjords.",
    stops:[
      {dest:"cph",dates:"Jun 16–18",nights:2,note:"Arrive. Torvehallerne, Nørrebro, Reffen market"},
      {dest:"sto",dates:"Jun 18–23",nights:5,note:"Midsommar Jun 20–21. More time in Stockholm than other routes.",meetup:true},
      {dest:"hel",dates:"Jun 23–26",nights:3,note:"Viking Line ferry. Kallio, Löyly sauna, market hall",meetup:true},
      {dest:"tal",dates:"Jun 26–28",nights:2,note:"Fast ferry. Telliskivi, Kalamaja, Old Town at dusk"},
      {dest:"rig",dates:"Jun 28–Jul 1",nights:3,note:"Lux Express bus (4.5hrs). Art Nouveau district, Central Market"},
      {dest:"osl",dates:"Jul 1–4",nights:3,note:"Fly RIG→OSL. Grünerløkka, Vigeland. Fly home Jul 4–5"},
    ],
    legs:["SMF-CPH","CPH-STO","STO-HEL","HEL-TAL","TAL-RIG","RIG-OSL","OSL-SMF"],
    budgetEst:{low:9800,mid:11400,high:14500},
    pros:["Riga is extraordinary — almost no Americans go","Tallinn + Riga = best architecture pairing on any route","40–60% cheaper than Nordic-only days in the Baltics","More time in Stockholm compensates for no Gothenburg","Oslo caps it off without the 7hr train commitment"],
    cons:["No Bergen or fjords — Norway is Oslo only","Riga→Oslo flight adds a leg","Lux Express bus is 4.5hrs — kids need prep"],
  },
};

// ─── POINTS ───────────────────────────────────────────────────────────────────
const POINTS = [
  {prog:"🏨 Bonvoy 200K + 40K FNA",saves:"$1,800–2,500",tip:"Use FNA at W Copenhagen (best single cert use — cash rate $400–500+, Cat 6–7). 200K points → Sheraton Stockholm + Helsinki Marriott = 3–4 more nights. Save Bonvoy for CPH/STO/HEL where coverage is actually good. Bergen and Oslo: use Thon Hotels with cash."},
  {prog:"✈️ United 50K + 80K UR transfer",saves:"$1,400–1,800",tip:"Transfer 80K Chase UR → United (1:1). Combined 130K covers 2 adult RT economy at ~60K each (SMF→CPH or SFO→CPH). Book on United.com on SAS metal. Saver award availability is best 3–4 months out."},
  {prog:"💳 Chase UR 82K remaining",saves:"$900–1,200",tip:"Use remaining 82K at 1.5cpp via Chase Travel Portal to book 2 kids' economy tickets (~$1,200 value). Or transfer to Hyatt for 1–2 nights at a top Nordic property (At Six Stockholm is a World of Hyatt Category 5)."},
  {prog:"💎 Amex MR 115K",saves:"$600–1,500",tip:"Hold and watch for Flying Blue (Air France/KLM) Promo Rewards — monthly, 20–50% off specific routes including SFO→CPH. If a promo appears, transfer and book vs. using UR for kids. Otherwise keep in reserve for future premium cabin use."},
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────
// ─── HIGHLIGHT VISUAL DATA · colors + icons per type ─────────────────────────
const HIGHLIGHT_COLORS = {
  cph:  ["#d97706","#b45309","#7c3aed","#059669","#dc2626","#0891b2","#0369a1","#6d28d9"],
  mal:  ["#0369a1","#374151","#d97706","#059669"],
  got:  ["#0891b2","#7c3aed","#dc2626","#b45309"],
  sto:  ["#6d28d9","#b45309","#059669","#1d4ed8","#d97706","#0369a1","#374151","#7c3aed"],
  upp:  ["#6d28d9","#059669","#0891b2"],
  hel:  ["#b45309","#7c3aed","#0369a1","#059669","#0891b2","#6d28d9","#374151","#b45309"],
  por:  ["#dc2626","#6d28d9","#b45309"],
  tal:  ["#374151","#6d28d9","#7c3aed","#1d4ed8","#059669","#0891b2","#d97706","#b45309"],
  rig:  ["#d97706","#b45309","#6d28d9","#7c3aed","#059669"],
  vil:  ["#7c3aed","#6d28d9","#374151","#b45309"],
  osl:  ["#059669","#b45309","#0369a1","#0891b2","#7c3aed","#d97706","#374151"],
  ber:  ["#dc2626","#0891b2","#059669","#1d4ed8","#6d28d9","#7c3aed"],
  fla:  ["#0369a1","#1d4ed8","#059669","#374151","#0891b2"],
  ale:  ["#0891b2","#1d4ed8","#059669"],
  lof:  ["#dc2626","#0369a1","#b45309","#d97706","#0891b2"],
  tro:  ["#d97706","#059669","#0369a1","#374151"],
};
const TYPE_ICONS = {food:"🍽",culture:"🏛",kids:"🎡",nature:"🌿",photo:"📷",history:"🏰",market:"🛍",art:"🎨",nightlife:"🌃"};
const TYPE_LABELS = {
  food:    ["Local flavors","Eat here","Food stop","Market vibes","Chef's pick"],
  culture: ["Must-see","Cultural gem","Local life","Neighborhood","City fabric"],
  kids:    ["Kid-approved","Family hit","Kids love it","Fun stop","Play & explore"],
  nature:  ["Get outside","Natural wonder","Scenic spot","Outdoor stop","Wild side"],
  history: ["History buff","Step back in time","Heritage site","Old world","Rich history"],
  art:     ["Art stop","Creative space","Gallery pick","Design gem","Visual hit"],
  market:  ["Market stop","Shop & eat","Local market","Vendors & food","Browse & graze"],
  nightlife:["Evening spot","Night pick","After dark","Evening scene","Night life"],
};
const DEST_FLAG = {cph:"🇩🇰",mal:"🇸🇪",got:"🇸🇪",sto:"🇸🇪",upp:"🇸🇪",hel:"🇫🇮",por:"🇫🇮",tal:"🇪🇪",rig:"🇱🇻",vil:"🇱🇹",osl:"🇳🇴",ber:"🇳🇴",fla:"🇳🇴",ale:"🇳🇴",lof:"🇳🇴",tro:"🇳🇴"};

// kept but unused — CORS prevents external images in this sandbox
const PHOTOS = {
  cph:[
    "https://commons.wikimedia.org/wiki/Special:FilePath/Torvehallerne_2013.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Reffen_street_food_market,_Copenhagen_(48801612076).jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Jægersborggade,_Nørrebro.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Christiania_in_2010.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Tivoli_gardens_night_2009.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Kødbyen_Copenhagen.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Nyhavn_canal_Copenhagen.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Designmuseum_Danmark_courtyard.jpg",
  ],
  mal:[
    "https://commons.wikimedia.org/wiki/Special:FilePath/Øresund_Bridge_from_above.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Stortorget_Malmo_2010.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Möllevångstorget_2012.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Lilla_torg_in_malmoe.jpg",
  ],
  got:[
    "https://commons.wikimedia.org/wiki/Special:FilePath/Feskekôrka_Gothenburg.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Haga_Gothenburg_Kronhusgatan.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Liseberg_2007.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Stora_Saluhallen_Göteborg_interior.jpg",
  ],
  sto:[
    "https://commons.wikimedia.org/wiki/Special:FilePath/Stockholm_Södermalm.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Östermalms_Saluhall_interior.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Skansen_open-air_museum_Stockholm.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Vasa_ship_1.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Midsommar_Sweden_maypole.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Stockholm_archipelago_summer.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Fotografiska_Stockholm.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Gamla_stan_Stockholm_aerial.jpg",
  ],
  upp:[
    "https://commons.wikimedia.org/wiki/Special:FilePath/Uppsala_domkyrka_2010.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Gamla_Uppsala_burial_mounds.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Uppsala_botanical_garden.jpg",
  ],
  hel:[
    "https://commons.wikimedia.org/wiki/Special:FilePath/Helsinki_Market_Hall_interior.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Kallio_Helsinki_street.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Löyly_Helsinki.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Suomenlinna_aerial.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Allas_Sea_Pool_Helsinki.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Temppeliaukio_church_interior.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Helsinki_Design_District.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Hakaniemen_kauppahalli.jpg",
  ],
  por:[
    "https://commons.wikimedia.org/wiki/Special:FilePath/Porvoo_riverside_warehouses.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Porvoo_Cathedral_2009.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Porvoo_old_town.jpg",
  ],
  tal:[
    "https://commons.wikimedia.org/wiki/Special:FilePath/Telliskivi_Creative_City_Tallinn.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Tallinn_old_town_evening.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Kalamaja_Tallinn.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Tallinn_city_wall.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Viru_raba_Lahemaa.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Tallinn_bay_view.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Telliskivi_creative_city.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Balti_jaam_market.jpg",
  ],
  rig:[
    "https://commons.wikimedia.org/wiki/Special:FilePath/Alberta_iela_Art_Nouveau_Riga.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Riga_Central_Market.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Riga_old_town_Dome_Cathedral.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Kalnciema_iela_Riga.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Latvian_Ethnographic_Open-Air_Museum.jpg",
  ],
  vil:[
    "https://commons.wikimedia.org/wiki/Special:FilePath/Uzupis_Vilnius.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Vilnius_old_town_aerial.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Vilnius_street_art.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Halės_turgus_Vilnius.jpg",
  ],
  osl:[
    "https://commons.wikimedia.org/wiki/Special:FilePath/Grünerløkka_Oslo.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Mathallen_Oslo.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Vigeland_sculpture_park_Oslo.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Oslofjord_ferry.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Ekeberg_park_Oslo.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Grønland_Oslo.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Norsk_Folkemuseum_Oslo.jpg",
  ],
  ber:[
    "https://commons.wikimedia.org/wiki/Special:FilePath/Bryggen,_Bergen3.JPG",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Bergen_fish_market.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Bergen_from_Fløyen.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Bergen_Norway.JPG",
    "https://commons.wikimedia.org/wiki/Special:FilePath/KODE_Museums_Bergen.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Nordnes_Bergen.jpg",
  ],
  fla:[
    "https://commons.wikimedia.org/wiki/Special:FilePath/Nærøyfjorden_Norway.JPG",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Flåmsbana_train_Norway.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Ferry_on_the_Nærøyfjord_(23559704255).jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Gudvangen_Norway.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Stegastein_viewpoint_Aurland.jpg",
  ],
  ale:[
    "https://commons.wikimedia.org/wiki/Special:FilePath/Ålesund_panorama.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Ålesund_Art_Nouveau.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Atlanterhavsparken_aquarium.jpg",
  ],
  lof:[
    "https://commons.wikimedia.org/wiki/Special:FilePath/Reine,_Lofoten,_Norway.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Henningsvær_Lofoten.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Rorbu_Lofoten_Norway.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Midnight_sun_Lofoten.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Lofoten_kayaking.jpg",
  ],
  tro:[
    "https://commons.wikimedia.org/wiki/Special:FilePath/Midnight_sun_Tromsø.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Arctic_Alpine_Botanical_Garden_Tromsø.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Polaria_Tromsø.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Sami_reindeer_Norway.jpg",
  ],
};

export default function NordicPlanner() {
  const [mainTab, setMainTab] = useState("routes");
  const [selRoute, setSelRoute] = useState("C");
  const [selDest, setSelDest] = useState("cph");
  const [destTab, setDestTab] = useState("highlights");
  const [selCountry, setSelCountry] = useState("denmark");
  const [budgetTier, setBudgetTier] = useState("mid");
  const [regionFilter, setRegionFilter] = useState("all");
  const [selTransLeg, setSelTransLeg] = useState(null);
  const [showPhotos, setShowPhotos] = useState(false);

  const route = ROUTES[selRoute];
  const dest = DESTINATIONS.find(d => d.id === selDest);
  const country = COUNTRIES.find(c => c.id === selCountry);
  const filteredDests = regionFilter === "all" ? DESTINATIONS : DESTINATIONS.filter(d => d.region === regionFilter);
  const tierColors = {low:"#4ade80", mid:"#60a5fa", high:"#f59e0b"};

  function Dots({n,max=5,color="#60a5fa"}) {
    return <span style={{display:"inline-flex",gap:"3px",verticalAlign:"middle"}}>
      {Array.from({length:max},(_,i)=><span key={i} style={{width:"7px",height:"7px",borderRadius:"50%",display:"inline-block",background:i<n?color:"rgba(255,255,255,0.1)"}}/>)}
    </span>;
  }

  function Badge({children,color="#60a5fa",bg}) {
    return <span style={{fontSize:"10px",padding:"2px 8px",borderRadius:"4px",background:bg||`${color}18`,color,fontFamily:M.mono,whiteSpace:"nowrap"}}>{children}</span>;
  }

  function SectionLabel({children,color=M.blue}) {
    return <div style={{fontSize:"9px",letterSpacing:"3px",textTransform:"uppercase",fontFamily:M.mono,color,marginBottom:"10px"}}>{children}</div>;
  }

  function Card({children,style={}}) {
    return <div style={{...M.card,...style}}>{children}</div>;
  }

  // Destination detail inner content
  function DestDetail() {
    if (!dest) return null;
    return (
      <div style={{padding:"0 0 24px"}}>
        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"12px",marginBottom:"14px"}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
              <span style={{fontSize:"28px"}}>{dest.flag}</span>
              <div>
                <h2 style={{margin:0,fontSize:"22px",fontWeight:"normal"}}>{dest.city}</h2>
                <div style={{fontSize:"11px",color:"#475569",fontFamily:M.mono}}>
                  {dest.country} · {dest.idealNights} nights · <span style={{color:typeColor[dest.type]}}>{typeLabel[dest.type]}</span>
                </div>
              </div>
            </div>
            <p style={{margin:"8px 0 0",fontSize:"12px",color:"#64748b",fontFamily:M.mono,maxWidth:"520px",lineHeight:1.75}}>{dest.summary}</p>
            <div style={{display:"flex",gap:"5px",marginTop:"8px",flexWrap:"wrap"}}>
              {dest.tags.map(t=><span key={t} style={{fontSize:"10px",padding:"2px 7px",borderRadius:"4px",background:"rgba(255,255,255,0.05)",color:"#475569",border:"1px solid rgba(255,255,255,0.08)",fontFamily:M.mono}}>{t}</span>)}
            </div>
          </div>
          <div style={{...M.card,padding:"12px",minWidth:"165px"}}>
            {[{k:"foodScore",l:"Food",c:"#f59e0b"},{k:"cultureScore",l:"Culture",c:"#60a5fa"},{k:"kidScore",l:"Kids",c:"#4ade80"},{k:"offPathScore",l:"Off-Path",c:"#fb923c"},{k:"photoScore",l:"Photo",c:"#e879f9"},{k:"cost",l:"Cost Level",c:"#f87171"}].map(s=>(
              <div key={s.k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"5px"}}>
                <span style={{fontSize:"9px",color:"#475569",fontFamily:M.mono}}>{s.l}</span>
                <Dots n={dest[s.k]} color={s.c}/>
              </div>
            ))}
          </div>
        </div>

        {/* Sub tabs */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid rgba(255,255,255,0.07)",marginBottom:"14px"}}>
          <div style={{display:"flex",gap:"2px"}}>
          {[
            {id:"highlights",label:"Highlights"},
            {id:"sidetrips",label:`Side Trips (${dest.sideTrips.length})`},
            {id:"hotels",label:"Where to Stay"},
            {id:"food",label:"Food Guide"},
            {id:"gettinghere",label:"Getting Here"},
          ].map(t=>(
            <button key={t.id} onClick={()=>setDestTab(t.id)} style={{
              background:"none",border:"none",cursor:"pointer",padding:"7px 11px",
              fontSize:"10px",letterSpacing:"1.5px",fontFamily:M.mono,textTransform:"uppercase",
              color:destTab===t.id?"#93c5fd":"#334155",
              borderBottom:destTab===t.id?"2px solid #60a5fa":"2px solid transparent",
            }}>{t.label}</button>
          ))}
          </div>
          {destTab==="highlights" && (
            <button onClick={()=>setShowPhotos(p=>!p)} style={{
              display:"flex",alignItems:"center",gap:"6px",
              background:showPhotos?"rgba(96,165,250,0.12)":"rgba(255,255,255,0.04)",
              border:showPhotos?"1px solid rgba(96,165,250,0.35)":"1px solid rgba(255,255,255,0.1)",
              borderRadius:"5px",padding:"4px 10px",cursor:"pointer",
              fontSize:"10px",color:showPhotos?"#93c5fd":"#475569",fontFamily:M.mono,
              transition:"all 0.15s",flexShrink:0,marginBottom:"2px",
            }}>
              <span style={{fontSize:"12px"}}>{showPhotos?"🎴":"□"}</span>
              {showPhotos ? "Cards On" : "Cards Off"}
            </button>
          )}
        </div>

        {destTab==="highlights" && dest.highlights.map((h,i)=>{
          return (
            <div key={i} style={{
              borderBottom:"1px solid rgba(255,255,255,0.04)",
              marginBottom: showPhotos ? "14px" : "0",
            }}>
              {showPhotos && (
                <div style={{
                  width:"100%", height:"140px", borderRadius:"8px", marginBottom:"10px",
                  overflow:"hidden", position:"relative",
                  background:`linear-gradient(135deg, ${(HIGHLIGHT_COLORS[dest.id]||[])[i]||"#1d4ed8"}22 0%, ${(HIGHLIGHT_COLORS[dest.id]||[])[i]||"#1d4ed8"}08 100%)`,
                  border:`1px solid ${(HIGHLIGHT_COLORS[dest.id]||[])[i]||"#1d4ed8"}30`,
                }}>
                  {/* decorative background circles */}
                  <div style={{position:"absolute",top:"-20px",right:"-20px",width:"120px",height:"120px",borderRadius:"50%",background:`${(HIGHLIGHT_COLORS[dest.id]||[])[i]||"#1d4ed8"}10`}}/>
                  <div style={{position:"absolute",bottom:"-30px",left:"30px",width:"90px",height:"90px",borderRadius:"50%",background:`${(HIGHLIGHT_COLORS[dest.id]||[])[i]||"#1d4ed8"}08`}}/>
                  {/* main icon */}
                  <div style={{position:"absolute",top:"16px",left:"18px",fontSize:"36px",lineHeight:1}}>
                    {TYPE_ICONS[h.type] || "📍"}
                  </div>
                  {/* flag + city */}
                  <div style={{position:"absolute",top:"14px",right:"14px",display:"flex",alignItems:"center",gap:"4px"}}>
                    <span style={{fontSize:"14px"}}>{DEST_FLAG[dest.id]||"🌍"}</span>
                    <span style={{fontSize:"9px",color:"rgba(255,255,255,0.35)",fontFamily:M.mono,letterSpacing:"0.5px"}}>{dest.city.toUpperCase()}</span>
                  </div>
                  {/* category badge */}
                  <div style={{position:"absolute",top:"58px",left:"18px"}}>
                    <div style={{
                      display:"inline-block",padding:"2px 8px",borderRadius:"3px",
                      background:`${(HIGHLIGHT_COLORS[dest.id]||[])[i]||"#1d4ed8"}30`,
                      border:`1px solid ${(HIGHLIGHT_COLORS[dest.id]||[])[i]||"#1d4ed8"}50`,
                      fontSize:"8px",color:(HIGHLIGHT_COLORS[dest.id]||[])[i]||"#60a5fa",
                      fontFamily:M.mono,textTransform:"uppercase",letterSpacing:"1px",fontWeight:"bold",
                    }}>
                      {((TYPE_LABELS[h.type]||["Highlight"])[i % (TYPE_LABELS[h.type]||["Highlight"]).length])}
                    </div>
                  </div>
                  {/* name at bottom */}
                  <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"8px 14px 10px",background:"linear-gradient(transparent,rgba(8,13,24,0.8))"}}>
                    <div style={{fontSize:"13px",fontWeight:"bold",color:"rgba(255,255,255,0.92)",lineHeight:1.2}}>{h.name}</div>
                  </div>
                </div>
              )}
              <div style={{display:"flex",gap:"12px",padding:showPhotos?"0 0 10px":"10px 0"}}>
                <div style={{minWidth:"52px",height:"20px",borderRadius:"3px",background:`${tagColor[h.type]||"#60a5fa"}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"8px",color:tagColor[h.type]||"#60a5fa",fontFamily:M.mono,textTransform:"uppercase",flexShrink:0}}>
                  {h.type}
                </div>
                <div>
                  <div style={{fontSize:"13px",fontWeight:"bold",marginBottom:"2px"}}>{h.name}</div>
                  <div style={{fontSize:"11px",color:"#64748b",fontFamily:M.mono,lineHeight:1.7}}>{h.note}</div>
                </div>
              </div>
            </div>
          );
        })}

        {destTab==="sidetrips" && (
          dest.sideTrips.length===0
            ? <div style={{fontSize:"13px",color:"#334155",fontStyle:"italic",fontFamily:M.mono}}>No notable side trips from this base.</div>
            : dest.sideTrips.map((s,i)=>(
              <Card key={i} style={{marginBottom:"10px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"10px",marginBottom:"6px"}}>
                  <div style={{fontSize:"14px",fontWeight:"bold"}}>{s.name}</div>
                  <Badge color="#60a5fa">⏱ {s.time}</Badge>
                </div>
                <div style={{fontSize:"11px",color:"#64748b",fontFamily:M.mono,lineHeight:1.7}}>{s.note}</div>
              </Card>
            ))
        )}

        {destTab==="hotels" && (
          <div>
            {dest.hotels.marriott.length>0 ? (
              <div style={{marginBottom:"16px"}}>
                <SectionLabel color="#60a5fa">Marriott Bonvoy</SectionLabel>
                {dest.hotels.marriott.map((h,i)=>(
                  <Card key={i} style={{border:"1px solid rgba(96,165,250,0.2)",marginBottom:"8px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",gap:"10px"}}>
                      <div>
                        <div style={{fontSize:"13px",fontWeight:"bold"}}>{h.name}</div>
                        <div style={{fontSize:"10px",color:"#475569",fontFamily:M.mono}}>{h.tier}</div>
                      </div>
                      <Badge color="#4ade80">🏅 {h.points}</Badge>
                    </div>
                    <div style={{fontSize:"11px",color:"#64748b",fontFamily:M.mono,marginTop:"7px",lineHeight:1.65}}>{h.note}</div>
                  </Card>
                ))}
              </div>
            ) : (
              <div style={{background:"rgba(248,113,113,0.06)",border:"1px solid rgba(248,113,113,0.15)",borderRadius:"7px",padding:"10px",marginBottom:"14px",fontSize:"11px",color:"#64748b",fontFamily:M.mono}}>
                ⚠️ No Marriott Bonvoy properties in this location — alternatives recommended below.
              </div>
            )}
            <SectionLabel color="#fb923c">Recommended Alternatives</SectionLabel>
            {dest.hotels.alt.map((h,i)=>(
              <Card key={i} style={{marginBottom:"8px"}}>
                <div style={{display:"flex",justifyContent:"space-between",gap:"10px"}}>
                  <div>
                    <div style={{fontSize:"13px",fontWeight:"bold"}}>{h.name}</div>
                    <div style={{fontSize:"10px",color:"#475569",fontFamily:M.mono}}>{h.tier}</div>
                  </div>
                  <Badge color="#fb923c">{h.price}</Badge>
                </div>
                <div style={{fontSize:"11px",color:"#64748b",fontFamily:M.mono,marginTop:"7px",lineHeight:1.65}}>{h.note}</div>
              </Card>
            ))}
            {dest.region==="norway" && (
              <Card style={{marginTop:"6px",fontSize:"11px",color:"#64748b",fontFamily:M.mono,lineHeight:1.65}}>
                <strong style={{color:"#94a3b8"}}>Thon Hotels:</strong> Norway's dominant hotel chain — breakfast always included, reliable quality, good locations. Best cash option where Bonvoy is thin.
              </Card>
            )}
          </div>
        )}

        {destTab==="food" && (
          <div>
            {dest.cookingClass && (
              <div style={{background:"rgba(245,158,11,0.07)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:"8px",padding:"12px",marginBottom:"12px"}}>
                <SectionLabel color="#f59e0b">👨‍🍳 Cooking Class</SectionLabel>
                <div style={{fontSize:"12px",color:"#64748b",fontFamily:M.mono,lineHeight:1.7}}>{dest.cookingClass}</div>
              </div>
            )}
            <div style={{background:"rgba(96,165,250,0.06)",border:"1px solid rgba(96,165,250,0.15)",borderRadius:"8px",padding:"12px",marginBottom:"12px"}}>
              <SectionLabel color="#60a5fa">💎 Splurge Pick</SectionLabel>
              <div style={{fontSize:"12px",color:"#64748b",fontFamily:M.mono,lineHeight:1.7}}>{dest.splurge}</div>
            </div>
            <SectionLabel>Food Highlights</SectionLabel>
            {dest.highlights.filter(h=>h.type==="food").length===0
              ? <div style={{fontSize:"12px",color:"#334155",fontStyle:"italic",fontFamily:M.mono}}>See Highlights tab for all food-related spots.</div>
              : dest.highlights.filter(h=>h.type==="food").map((h,i)=>(
                <div key={i} style={{padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",display:"flex",gap:"12px"}}>
                  <div style={{fontSize:"13px",fontWeight:"bold",minWidth:"180px"}}>{h.name}</div>
                  <div style={{fontSize:"11px",color:"#64748b",fontFamily:M.mono,lineHeight:1.7}}>{h.note}</div>
                </div>
              ))
            }
          </div>
        )}

        {destTab==="gettinghere" && (
          <div>
            <p style={{fontSize:"12px",color:"#64748b",fontFamily:M.mono,marginTop:0,marginBottom:"14px",lineHeight:1.7}}>
              Most efficient transport options to and from {dest.city}. ⭐ = recommended.
            </p>
            {(dest.transportKeys||[]).length===0
              ? <div style={{fontSize:"12px",color:"#334155",fontStyle:"italic",fontFamily:M.mono}}>Transport varies — see the Transport tab for all route legs.</div>
              : (dest.transportKeys||[]).map(key=>{
                const t = TRANSPORT[key];
                if(!t) return null;
                return (
                  <Card key={key} style={{marginBottom:"12px"}}>
                    <div style={{fontSize:"13px",fontWeight:"bold",marginBottom:"10px",color:"#93c5fd"}}>
                      {t.from} → {t.to}
                    </div>
                    {t.options.map((opt,i)=>(
                      <div key={i} style={{background:opt.rec?"rgba(74,222,128,0.05)":"rgba(255,255,255,0.02)",border:opt.rec?"1px solid rgba(74,222,128,0.15)":"1px solid rgba(255,255,255,0.05)",borderRadius:"7px",padding:"10px",marginBottom:"8px"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"8px",marginBottom:"6px"}}>
                          <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                            <span style={{fontSize:"18px"}}>{opt.mode.split(" ")[0]}</span>
                            <div>
                              <div style={{fontSize:"12px",fontWeight:"bold"}}>{opt.mode.replace(/^[^\s]+\s/,"")}</div>
                              <div style={{fontSize:"10px",color:"#475569",fontFamily:M.mono}}>{opt.op}</div>
                            </div>
                            {opt.rec && <Badge color="#4ade80">⭐ Recommended</Badge>}
                          </div>
                          <div style={{textAlign:"right"}}>
                            <div style={{fontSize:"14px",color:"#60a5fa",fontFamily:M.mono}}>{opt.dur}</div>
                          </div>
                        </div>
                        <div style={{fontSize:"11px",color:"#4ade80",fontFamily:M.mono,marginBottom:"4px"}}>{opt.cost}</div>
                        <div style={{fontSize:"11px",color:"#64748b",fontFamily:M.mono,lineHeight:1.7}}>{opt.tip}</div>
                      </div>
                    ))}
                  </Card>
                );
              })
            }
          </div>
        )}

        {/* Atlas note */}
        <div style={{marginTop:"18px",background:"rgba(96,165,250,0.06)",border:"1px solid rgba(96,165,250,0.15)",borderRadius:"8px",padding:"12px"}}>
          <SectionLabel color="#60a5fa">🧭 Atlas Note</SectionLabel>
          <div style={{fontSize:"11px",color:"#64748b",fontFamily:M.mono,lineHeight:1.75}}>
            {dest.id==="cph" && "Copenhagen is where food priority #1 gets fully satisfied. Nørrebro and Reffen deserve a slow evening each. The Roskilde Viking Ship Museum is the single best kid day trip in Denmark — legitimately interesting for adults too."}
            {dest.id==="mal" && "Most people skip Malmö entirely. It's worth 4–5 hours if you want to say you've been to Sweden, cross the bridge, and eat genuinely good falafel in Möllevångstorget. Don't stay overnight — Copenhagen is a better base."}
            {dest.id==="got" && "Best deployed as a 1-night train stopover between Copenhagen and Stockholm. Liseberg is the strategic kids' reset card that buys goodwill for 2 food-focused days in Stockholm. The food market and Fish Church are the adult activities."}
            {dest.id==="sto" && "Stockholm is the K+A Family meetup anchor. Lock the Midsommar evening at Skansen — it's June 20 or 21, right on your window, and it's a genuine cultural moment. The Viking Line overnight ferry to Helsinki is a highlight, not just transport. Book it now."}
            {dest.id==="upp" && "Uppsala is best as a half-day from Stockholm. The Viking burial mounds at Gamla Uppsala are genuinely eerie and kids can climb them — that's the reason to go. Add the cathedral and call it done."}
            {dest.id==="hel" && "Helsinki is the most underrated city on the trip. Look for Finnish-Japanese restaurants — chefs trained in Japan returning to cook Finnish ingredients with Japanese precision. Löyly sauna is non-negotiable. Porvoo by boat is the strongest half-day trip. Book the Viking Line ferry to Stockholm as soon as your dates are set."}
            {dest.id==="por" && "Porvoo is worth it specifically for the boat trip approach from Helsinki — the red warehouses from the water are one of Finland's signature images. Take the boat one way, bus back. Don't stay overnight unless you want the town to yourself."}
            {dest.id==="tal" && "Tallinn is the best value-per-surprise on the entire trip. The key: get outside the old town walls into Telliskivi and Kalamaja — that's where actual Tallinn lives. Everything costs 40–50% less than the Nordics. The Viru Bog boardwalk is unusual enough to be genuinely memorable for the kids. Worth noting: the K+A Family is potentially interested in joining for Tallinn — the 2-hr Helsinki ferry is easy enough that it's a real option if they want to extend the meetup."}
            {dest.id==="rig" && "Riga gets overlooked because Tallinn is easier from Helsinki. But the Art Nouveau district is more architecturally stunning than Tallinn's medieval old town, and the Central Market in the Zeppelin hangars is one of Europe's great food experiences. Add 2 nights after Tallinn if you can absorb the extra days."}
            {dest.id==="vil" && "Vilnius is the most under-the-radar city in all of Europe for what it offers. Užupis alone is worth the trip — a neighborhood that voted to become a republic, with its own constitution and president. Everything here costs remarkably little. Trakai Castle is an absolute kids' highlight."}
            {dest.id==="osl" && "Oslo is most valuable for food. Grünerløkka is where you want to be in the evenings. If Maaemo is on your radar, book it 3–6 months before travel — it's genuinely one of the world's 20 best restaurants. The Vigeland Park is free, large, and the bizarre sculptures captivate kids unexpectedly."}
            {dest.id==="ber" && "Bergen is best as a fjord gateway — 2 nights is exactly right, don't overallocate. The Norway in a Nutshell fjord day needs to be booked weeks ahead. Mt. Fløyen funicular + hike down is the perfect activity that doesn't feel like a concession to the kids."}
            {dest.id==="fla" && "Overnight in Flåm changes the experience — you have the fjord to yourself after 6pm when day-trippers leave. Kayaking is the activity upgrade over the tour boat. Viking Valley in Gudvangen is a genuine surprise — not a tourist trap, actually well done."}
            {dest.id==="ale" && "Ålesund is for photographers. The Art Nouveau cityscape is unlike anything else in Scandinavia, and Geirangerfjord from here is the most dramatic fjord option on the trip. Only justified if you're willing to add a 45-min flight from Bergen and 2–3 days."}
            {dest.id==="lof" && "Lofoten is a significant detour — fly from Oslo, 2hrs. Only justified at 3+ nights. The midnight sun in late June is extraordinary. The rorbu cabin experience is available nowhere else on earth. This is a dedicated photography and nature trip, not an add-on."}
            {dest.id==="tro" && "Tromsø in late June is the midnight sun experience — hiking at 11pm in golden light is disorienting and extraordinary. The Northern Lights are NOT visible in summer (you need darkness). Worth adding if you have 2 extra days and want the Arctic Circle."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{fontFamily:M.font,background:M.bg,minHeight:"100vh",color:"#dde3ed",display:"flex",flexDirection:"column",overflow:"hidden",height:"100vh",maxWidth:"1400px",margin:"0 auto",position:"relative",boxShadow:"0 0 40px rgba(0,0,0,0.5)"}}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      {/* Header */}
      <div style={{padding:"16px 24px 12px",borderBottom:"1px solid rgba(255,255,255,0.07)",background:"linear-gradient(180deg,rgba(255,255,255,0.03) 0%,transparent 100%)",flexShrink:0}}>
        <div style={{fontSize:"9px",letterSpacing:"4px",color:"#60a5fa",fontFamily:M.mono,marginBottom:"3px"}}>ATLAS · NORDIC FAMILY TRIP · SUMMER 2025</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"8px"}}>
          <h1 style={{margin:0,fontSize:"22px",fontWeight:"normal",letterSpacing:"-0.5px"}}>Nordic Trip Planner</h1>
          <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
            {[{k:"Meetup",v:"Jun 20–28 · SWE + FIN"},{k:"Budget",v:"<$12K family of 4"},{k:"Points",v:"200K Bonvoy · 50K UA · 162K UR · 115K MR"}].map(({k,v})=>(
              <div key={k} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"5px",padding:"4px 10px"}}>
                <div style={{fontSize:"8px",color:"#334155",letterSpacing:"2px",fontFamily:M.mono,textTransform:"uppercase"}}>{k}</div>
                <div style={{fontSize:"11px",color:"#94a3b8",fontFamily:M.mono}}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main tabs */}
      <div style={{display:"flex",borderBottom:"1px solid rgba(255,255,255,0.07)",background:"rgba(0,0,0,0.2)",flexShrink:0}}>
        {[{id:"routes",l:"Routes"},{id:"countries",l:"Countries"},{id:"destinations",l:"Destinations"},{id:"transport",l:"Transport"},{id:"budget",l:"Budget & Points"}].map(t=>(
          <button key={t.id} onClick={()=>setMainTab(t.id)} style={{
            background:"none",border:"none",cursor:"pointer",padding:"10px 18px",
            fontSize:"11px",letterSpacing:"2px",fontFamily:M.mono,textTransform:"uppercase",
            color:mainTab===t.id?"#93c5fd":"#334155",
            borderBottom:mainTab===t.id?"2px solid #60a5fa":"2px solid transparent",
          }}>{t.l}</button>
        ))}
      </div>

      {/* Content area */}
      <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>

        {/* ═══ ROUTES ═══ */}
        {mainTab==="routes" && (
          <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>
          <div style={{maxWidth:"100%", margin:"0 auto"}}>
            <p style={{color:"#64748b",marginTop:0,marginBottom:"16px",fontSize:"12px",fontFamily:M.mono,maxWidth:"680px"}}>
              Four route architectures. All lock in Stockholm + Helsinki for the K+A Family meetup window. Click any stop's Details button to jump to that city.
            </p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"10px",marginBottom:"18px"}}>
              {Object.values(ROUTES).map(r=>(
                <button key={r.id} onClick={()=>setSelRoute(r.id)} style={{
                  ...M.card,border:selRoute===r.id?"1px solid rgba(96,165,250,0.45)":"1px solid rgba(255,255,255,0.07)",
                  background:selRoute===r.id?"rgba(96,165,250,0.08)":"rgba(255,255,255,0.02)",
                  cursor:"pointer",textAlign:"left",transition:"all 0.15s",
                }}>
                  <div style={{fontSize:"20px",marginBottom:"3px"}}>{r.emoji} <span style={{fontSize:"16px",color:selRoute===r.id?"#93c5fd":"#64748b",fontFamily:M.mono}}>Route {r.id}</span></div>
                  <div style={{fontSize:"13px",fontWeight:"bold",marginBottom:"3px"}}>{r.name}</div>
                  <div style={{fontSize:"10px",color:"#475569",fontFamily:M.mono,marginBottom:"8px",fontStyle:"italic"}}>{r.tagline}</div>
                  <div style={{display:"flex",gap:"5px",flexWrap:"wrap",marginBottom:"8px"}}>
                    <Badge color="#94a3b8">{r.duration}</Badge>
                    {r.norway && <Badge color="#4ade80">Norway ✓</Badge>}
                    {r.tallinn && <Badge color="#fb923c">Tallinn ✓</Badge>}
                  </div>
                  <div style={{fontSize:"17px",color:"#60a5fa",fontFamily:M.mono}}>${r.budgetEst.mid.toLocaleString()} <span style={{fontSize:"10px",color:"#475569"}}>mid est.</span></div>
                </button>
              ))}
            </div>

            <Card>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"12px",marginBottom:"16px"}}>
                <div>
                  <h2 style={{margin:0,fontSize:"20px",fontWeight:"normal"}}>{route.emoji} Route {route.id}: {route.name}</h2>
                  <p style={{margin:"5px 0 0",fontSize:"12px",color:"#64748b",fontFamily:M.mono,maxWidth:"560px",lineHeight:1.75}}>{route.desc}</p>
                </div>
                <div style={{textAlign:"right",fontFamily:M.mono}}>
                  <div style={{fontSize:"10px",color:"#4ade80"}}>with points: ~${(route.budgetEst.mid-4000).toLocaleString()}–${(route.budgetEst.mid-3500).toLocaleString()}</div>
                  <div style={{fontSize:"17px",color:"#60a5fa",fontWeight:"bold"}}>${route.budgetEst.mid.toLocaleString()} mid cash</div>
                  <div style={{fontSize:"10px",color:"#f59e0b"}}>${route.budgetEst.high.toLocaleString()} luxury</div>
                </div>
              </div>

              <SectionLabel>Itinerary Timeline</SectionLabel>
              {route.stops.map((stop,i)=>{
                const d = DESTINATIONS.find(x=>x.id===stop.dest);
                const isMeetup = stop.meetup === true;
                return (
                  <div key={i} style={{
                    display:"flex",alignItems:"flex-start",gap:"10px",padding:"8px 10px",marginBottom:"4px",borderRadius:"7px",
                    background:isMeetup?"rgba(250,204,21,0.07)":"rgba(255,255,255,0.02)",
                    borderLeft:isMeetup?"3px solid rgba(250,204,21,0.55)":"3px solid transparent",
                    boxShadow:isMeetup?"inset 0 0 0 1px rgba(250,204,21,0.12)":"none",
                  }}>
                    <div style={{minWidth:"82px",fontSize:"10px",color:"#475569",fontFamily:M.mono,paddingTop:"2px"}}>{stop.dates}</div>
                    <span style={{fontSize:"15px"}}>{d?.flag}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:"13px",fontWeight:"bold",display:"flex",alignItems:"center",gap:"7px"}}>
                        {d?.city}
                        {isMeetup && <span style={{fontSize:"9px",padding:"2px 7px",borderRadius:"3px",background:"rgba(250,204,21,0.15)",color:"#fbbf24",fontFamily:M.mono,letterSpacing:"1px",fontWeight:"normal",textTransform:"uppercase"}}>K+A Meetup</span>}
                      </div>
                      <div style={{fontSize:"10px",color:"#64748b",fontFamily:M.mono,marginTop:"1px"}}>{stop.note}</div>
                    </div>
                    <div style={{fontSize:"10px",color:"#334155",fontFamily:M.mono,paddingTop:"2px"}}>{stop.nights}n</div>
                    <button onClick={()=>{setSelDest(stop.dest);setDestTab("highlights");setMainTab("destinations");}} style={{background:"rgba(96,165,250,0.1)",border:"1px solid rgba(96,165,250,0.2)",borderRadius:"4px",padding:"3px 8px",cursor:"pointer",fontSize:"10px",color:"#60a5fa",fontFamily:M.mono}}>Details →</button>
                  </div>
                );
              })}
              <div style={{display:"flex",alignItems:"center",gap:"8px",marginTop:"6px"}}>
                <div style={{width:"12px",height:"12px",borderRadius:"2px",background:"rgba(250,204,21,0.15)",border:"1px solid rgba(250,204,21,0.4)",flexShrink:0}}/>
                <div style={{fontSize:"10px",color:"#64748b",fontFamily:M.mono}}>K+A Family meetup window · Jun 20–28 · Stockholm + Helsinki</div>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px",marginTop:"16px"}}>
                <div>
                  <SectionLabel color="#4ade80">Strengths</SectionLabel>
                  {route.pros.map((p,i)=><div key={i} style={{fontSize:"12px",color:"#64748b",fontFamily:M.mono,marginBottom:"5px",display:"flex",gap:"7px"}}><span style={{color:"#4ade80"}}>+</span>{p}</div>)}
                </div>
                <div>
                  <SectionLabel color="#f87171">Tradeoffs</SectionLabel>
                  {route.cons.map((c,i)=><div key={i} style={{fontSize:"12px",color:"#64748b",fontFamily:M.mono,marginBottom:"5px",display:"flex",gap:"7px"}}><span style={{color:"#f87171"}}>−</span>{c}</div>)}
                </div>
              </div>
            </Card>

            <div style={{marginTop:"14px",background:"rgba(96,165,250,0.07)",border:"1px solid rgba(96,165,250,0.2)",borderRadius:"9px",padding:"14px"}}>
              <SectionLabel color="#60a5fa">🧭 Atlas Recommendation</SectionLabel>
              <p style={{margin:0,fontSize:"12px",color:"#64748b",fontFamily:M.mono,lineHeight:1.8}}>
                <strong style={{color:"#93c5fd"}}>Route B</strong> best fits the overall profile — Tallinn + Bergen + the Oslo→Bergen train in one arc. Cash mid-range ~$12,400 but points drops effective cost to <strong style={{color:"#4ade80"}}>~$8,500–$9,500</strong>. <strong style={{color:"#93c5fd"}}>Route C</strong> is the cleanest under-$12K option with fjords. <strong style={{color:"#a78bfa"}}>Route D</strong> is the call if Riga and off-beaten-path depth matter more than fjords — best overall food and architecture value. <strong style={{color:"#60a5fa"}}>Route A</strong> is the lowest-stress choice that still gets you Tallinn. If K+A Family wants to join in Tallinn, any route with the Helsinki ferry works.
              </p>
            </div>
          </div>
          </div>
        )}

        {/* ═══ COUNTRIES ═══ */}
        {mainTab==="countries" && (
          <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>
          <div style={{maxWidth:"100%", margin:"0 auto"}}>
            {/* Country selector */}
            <div style={{display:"flex",gap:"8px",marginBottom:"20px",flexWrap:"wrap"}}>
              {COUNTRIES.map(c=>(
                <button key={c.id} onClick={()=>setSelCountry(c.id)} style={{
                  background:selCountry===c.id?"rgba(96,165,250,0.12)":"rgba(255,255,255,0.03)",
                  border:selCountry===c.id?"1px solid rgba(96,165,250,0.4)":"1px solid rgba(255,255,255,0.08)",
                  borderRadius:"7px",padding:"10px 16px",cursor:"pointer",textAlign:"left",
                  color:selCountry===c.id?"#93c5fd":"#64748b",
                }}>
                  <div style={{fontSize:"20px",marginBottom:"3px"}}>{c.flag}</div>
                  <div style={{fontSize:"12px",fontWeight:"bold"}}>{c.name}</div>
                  <div style={{fontSize:"10px",color:"#334155",fontFamily:M.mono,marginTop:"2px"}}>{DESTINATIONS.filter(d=>d.region===c.id).length} destinations</div>
                </button>
              ))}
            </div>

            {country && (
              <div>
                <div style={{marginBottom:"18px"}}>
                  <div style={{display:"flex",alignItems:"baseline",gap:"12px",marginBottom:"6px"}}>
                    <h2 style={{margin:0,fontSize:"24px",fontWeight:"normal"}}>{country.flag} {country.name}</h2>
                    <span style={{fontSize:"13px",color:"#60a5fa",fontStyle:"italic",fontFamily:M.mono}}>{country.tagline}</span>
                  </div>
                  <p style={{margin:"0 0 12px",fontSize:"13px",color:"#64748b",fontFamily:M.mono,lineHeight:1.8,maxWidth:"720px"}}>{country.summary}</p>
                  <div style={{display:"flex",gap:"24px",flexWrap:"wrap",marginBottom:"12px"}}>
                    <div>
                      <SectionLabel>Best For</SectionLabel>
                      <div style={{fontSize:"12px",color:"#94a3b8",fontFamily:M.mono}}>{country.bestFor}</div>
                    </div>
                    <div>
                      <SectionLabel>When to Visit</SectionLabel>
                      <div style={{fontSize:"12px",color:"#94a3b8",fontFamily:M.mono}}>{country.season}</div>
                    </div>
                  </div>
                  <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"7px",padding:"10px 14px",marginBottom:"16px",fontSize:"11px",color:"#64748b",fontFamily:M.mono,lineHeight:1.7}}>
                    <strong style={{color:"#94a3b8"}}>Practical:</strong> {country.practicalNotes}
                  </div>

                  <SectionLabel color="#4ade80">Country Highlights</SectionLabel>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"8px",marginBottom:"20px"}}>
                    {country.highlights.map((h,i)=>(
                      <div key={i} style={{background:"rgba(74,222,128,0.07)",border:"1px solid rgba(74,222,128,0.15)",borderRadius:"6px",padding:"6px 12px",fontSize:"12px",color:"#94a3b8",fontFamily:M.mono}}>
                        {h}
                      </div>
                    ))}
                  </div>
                </div>

                <SectionLabel>Destinations in {country.name}</SectionLabel>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"12px"}}>
                  {DESTINATIONS.filter(d=>d.region===country.id).map(d=>(
                    <button key={d.id} onClick={()=>{setSelDest(d.id);setDestTab("highlights");setMainTab("destinations");}} style={{
                      ...M.card,cursor:"pointer",textAlign:"left",transition:"all 0.15s",
                      borderLeft:`4px solid ${typeColor[d.type]}`,
                    }}>
                      <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"6px"}}>
                        <span style={{fontSize:"18px"}}>{d.flag}</span>
                        <div>
                          <div style={{fontSize:"14px",fontWeight:"bold"}}>{d.city}</div>
                          <div style={{fontSize:"10px",fontFamily:M.mono,color:typeColor[d.type]}}>{typeLabel[d.type]} · {d.idealNights} nights</div>
                        </div>
                      </div>
                      <p style={{margin:"0 0 8px",fontSize:"11px",color:"#64748b",fontFamily:M.mono,lineHeight:1.65,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{d.summary}</p>
                      <div style={{display:"flex",gap:"10px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:"4px"}}><span style={{fontSize:"9px",color:"#475569",fontFamily:M.mono}}>FOOD</span><Dots n={d.foodScore} max={5} color="#f59e0b"/></div>
                        <div style={{display:"flex",alignItems:"center",gap:"4px"}}><span style={{fontSize:"9px",color:"#475569",fontFamily:M.mono}}>OFF-PATH</span><Dots n={d.offPathScore} max={5} color="#fb923c"/></div>
                        <div style={{display:"flex",alignItems:"center",gap:"4px"}}><span style={{fontSize:"9px",color:"#475569",fontFamily:M.mono}}>KIDS</span><Dots n={d.kidScore} max={5} color="#4ade80"/></div>
                      </div>
                      <div style={{marginTop:"8px",fontSize:"10px",color:"#60a5fa",fontFamily:M.mono}}>View full details →</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          </div>
        )}

        {/* ═══ DESTINATIONS ═══ */}
        {mainTab==="destinations" && (
          <div style={{flex:1,display:"flex",gap:"0",overflow:"hidden"}}>
            {/* Left sidebar — independently scrollable */}
            <div style={{width:"210px",minWidth:"210px",flexShrink:0,display:"flex",flexDirection:"column",borderRight:"1px solid rgba(255,255,255,0.07)",background:"rgba(0,0,0,0.1)"}}>
              <div style={{padding:"12px 10px 8px",flexShrink:0}}>
                <div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>
                  {[{id:"all",l:"All"},{id:"denmark",l:"🇩🇰"},{id:"sweden",l:"🇸🇪"},{id:"finland",l:"🇫🇮"},{id:"baltics",l:"🇪🇪🇱🇻🇱🇹"},{id:"norway",l:"🇳🇴"}].map(r=>(
                    <button key={r.id} onClick={()=>setRegionFilter(r.id)} style={{
                      background:regionFilter===r.id?"rgba(96,165,250,0.15)":"rgba(255,255,255,0.04)",
                      border:regionFilter===r.id?"1px solid rgba(96,165,250,0.35)":"1px solid rgba(255,255,255,0.08)",
                      borderRadius:"4px",padding:"3px 7px",cursor:"pointer",
                      color:regionFilter===r.id?"#93c5fd":"#475569",fontSize:"11px",fontFamily:M.mono,
                    }}>{r.l}</button>
                  ))}
                </div>
              </div>
              <div style={{flex:1,overflowY:"auto"}}>
              {filteredDests.map(d=>(
                <button key={d.id} onClick={()=>{setSelDest(d.id);setDestTab("highlights");}} style={{
                  width:"100%",background:"none",border:"none",cursor:"pointer",textAlign:"left",
                  borderLeft:selDest===d.id?`3px solid ${typeColor[d.type]}`:"3px solid transparent",
                  borderBottom:"1px solid rgba(255,255,255,0.04)",padding:"8px 10px",
                  background:selDest===d.id?"rgba(96,165,250,0.05)":"transparent",
                }}>
                  <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                    <span style={{fontSize:"13px"}}>{d.flag}</span>
                    <div>
                      <div style={{fontSize:"11px",fontWeight:"bold",color:selDest===d.id?"#e2e8f0":"#94a3b8"}}>{d.city}</div>
                      <div style={{fontSize:"9px",color:"#334155",fontFamily:M.mono}}>{d.idealNights}n · <span style={{color:typeColor[d.type]}}>{typeLabel[d.type]}</span></div>
                    </div>
                  </div>
                </button>
              ))}
              </div>
            </div>

            {/* Right detail — independently scrollable */}
            <div style={{flex:1,minWidth:0,overflowY:"auto",padding:"20px 24px"}}>
              <DestDetail/>
            </div>
          </div>
        )}

        {/* ═══ TRANSPORT ═══ */}
        {mainTab==="transport" && (
          <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>
          <div style={{maxWidth:"100%", margin:"0 auto"}}>
            <p style={{color:"#64748b",marginTop:0,marginBottom:"20px",fontSize:"12px",fontFamily:M.mono,maxWidth:"680px",lineHeight:1.7}}>
              Ideal transport for each proposed route. Each leg shows the recommended option and why. Click any leg for full alternatives.
            </p>

            {Object.values(ROUTES).map(r=>(
              <div key={r.id} style={{marginBottom:"28px"}}>
                <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"12px"}}>
                  <span style={{fontSize:"18px"}}>{r.emoji}</span>
                  <div>
                    <div style={{fontSize:"15px",fontWeight:"bold"}}>Route {r.id}: {r.name}</div>
                    <div style={{fontSize:"11px",color:"#475569",fontFamily:M.mono}}>{r.dates} · {r.duration}</div>
                  </div>
                </div>

                <div style={{position:"relative",paddingLeft:"20px",borderLeft:"2px solid rgba(255,255,255,0.08)"}}>
                  {r.legs.map((legKey,i)=>{
                    const t = TRANSPORT[legKey];
                    if(!t) return null;
                    const best = t.options.find(o=>o.rec)||t.options[0];
                    const isSelected = selTransLeg===legKey;
                    return (
                      <div key={legKey} style={{marginBottom:"8px",position:"relative"}}>
                        {/* dot on timeline */}
                        <div style={{position:"absolute",left:"-25px",top:"12px",width:"8px",height:"8px",borderRadius:"50%",background:"#60a5fa",border:"2px solid #080d18"}}/>
                        <button onClick={()=>setSelTransLeg(isSelected?null:legKey)} style={{
                          ...M.card,width:"100%",textAlign:"left",cursor:"pointer",
                          border:isSelected?"1px solid rgba(96,165,250,0.4)":"1px solid rgba(255,255,255,0.07)",
                          background:isSelected?"rgba(96,165,250,0.06)":"rgba(255,255,255,0.02)",
                          padding:"10px 14px",transition:"all 0.15s",
                        }}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"8px"}}>
                            <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                              <span style={{fontSize:"18px"}}>{best.mode.split(" ")[0]}</span>
                              <div>
                                <div style={{fontSize:"12px",fontWeight:"bold",color:"#e2e8f0"}}>{t.from} → {t.to}</div>
                                <div style={{fontSize:"10px",color:"#475569",fontFamily:M.mono}}>{best.mode.replace(/^[^\s]+\s/,"")} · {best.op}</div>
                              </div>
                            </div>
                            <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
                              <div style={{textAlign:"right"}}>
                                <div style={{fontSize:"13px",color:"#60a5fa",fontFamily:M.mono}}>{best.dur}</div>
                                <div style={{fontSize:"10px",color:"#4ade80",fontFamily:M.mono}}>{best.cost.split("·")[0].trim()}</div>
                              </div>
                              <span style={{fontSize:"10px",color:"#334155",fontFamily:M.mono}}>{isSelected?"▲":"▼"}</span>
                            </div>
                          </div>

                          {isSelected && (
                            <div style={{marginTop:"10px",borderTop:"1px solid rgba(255,255,255,0.07)",paddingTop:"10px"}}>
                              <div style={{fontSize:"11px",color:"#64748b",fontFamily:M.mono,lineHeight:1.75,marginBottom:"8px"}}>{best.tip}</div>
                              {t.options.length>1 && (
                                <div>
                                  <div style={{fontSize:"9px",color:"#334155",fontFamily:M.mono,letterSpacing:"2px",marginBottom:"6px"}}>OTHER OPTIONS</div>
                                  {t.options.filter(o=>!o.rec).map((opt,j)=>(
                                    <div key={j} style={{background:"rgba(248,113,113,0.06)",border:"1px solid rgba(248,113,113,0.12)",borderRadius:"6px",padding:"8px 10px",marginBottom:"6px"}}>
                                      <div style={{fontSize:"11px",color:"#f87171",fontFamily:M.mono,marginBottom:"3px"}}>{opt.mode} · {opt.dur}</div>
                                      <div style={{fontSize:"11px",color:"#475569",fontFamily:M.mono,lineHeight:1.6}}>{opt.tip}</div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Key transport callouts */}
            <div style={{...M.card,background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.2)"}}>
              <SectionLabel color="#f59e0b">⚡ Book These First — Fill Up in Summer</SectionLabel>
              {[
                {name:"Stockholm → Helsinki — Viking Line overnight ferry",why:"Fills completely in summer. Best 4-berth cabin sells out. Book now at vikingline.com."},
                {name:"Nærøyfjord boat cruise (Flåm→Gudvangen)",why:"Sells out weeks ahead in July. Book at thefjords.com as soon as dates are set."},
                {name:"Oslo → Bergen — Bergensbanen 8:25am departure",why:"Morning trains book out early. Book at vy.no — reserve seats in the family/panorama carriage."},
                {name:"Maaemo, Oslo (if splurging)",why:"Books out 3–6 months ahead. This week-of availability does not exist for this restaurant."},
              ].map((item,i)=>(
                <div key={i} style={{display:"flex",gap:"10px",padding:"7px 0",borderBottom:i<3?"1px solid rgba(255,255,255,0.05)":"none"}}>
                  <span style={{color:"#f59e0b",fontFamily:M.mono,marginTop:"1px"}}>!</span>
                  <div>
                    <div style={{fontSize:"12px",fontWeight:"bold"}}>{item.name}</div>
                    <div style={{fontSize:"11px",color:"#64748b",fontFamily:M.mono,marginTop:"2px"}}>{item.why}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
        )}

        {/* ═══ BUDGET & POINTS ═══ */}
        {mainTab==="budget" && (
          <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>
          <div style={{maxWidth:"100%", margin:"0 auto"}}>
            <div style={{display:"flex",gap:"8px",marginBottom:"18px"}}>
              {Object.entries({low:"Points-Optimized",mid:"Mid-Range",high:"No Compromises"}).map(([k,l])=>(
                <button key={k} onClick={()=>setBudgetTier(k)} style={{
                  ...M.card,border:budgetTier===k?`1px solid ${tierColors[k]}`:"1px solid rgba(255,255,255,0.07)",
                  background:budgetTier===k?`${tierColors[k]}10`:"rgba(255,255,255,0.02)",
                  cursor:"pointer",padding:"9px 16px",color:budgetTier===k?tierColors[k]:"#475569",
                  fontFamily:M.mono,fontSize:"11px",letterSpacing:"1px",textTransform:"uppercase",
                }}>{l}</button>
              ))}
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"10px",marginBottom:"20px"}}>
              {Object.values(ROUTES).map(r=>{
                const v=r.budgetEst[budgetTier];
                const under=v<=12000;
                return (
                  <Card key={r.id} style={{border:`1px solid ${under?"rgba(74,222,128,0.2)":"rgba(248,113,113,0.2)"}`}}>
                    <div style={{fontSize:"13px",fontWeight:"bold",marginBottom:"3px"}}>{r.emoji} Route {r.id}</div>
                    <div style={{fontSize:"24px",color:under?"#4ade80":"#f87171",fontFamily:M.mono,marginBottom:"4px"}}>${v.toLocaleString()}</div>
                    <Badge color={under?"#4ade80":"#f87171"}>{under?"✓ Under $12K":"Over $12K"}</Badge>
                    <div style={{fontSize:"10px",color:"#475569",fontFamily:M.mono,marginTop:"6px"}}>{r.duration}</div>
                  </Card>
                );
              })}
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"20px"}}>
              <div>
                <SectionLabel>Route B Breakdown — 4 People, 19 Days</SectionLabel>
                <Card>
                  {[
                    {cat:"Flights RT (all 4)",low:"$2,800",mid:"$3,200",high:"$6,000"},
                    {cat:"Accommodation (19 nights)",low:"$2,400",mid:"$3,800",high:"$5,500"},
                    {cat:"Food & Dining",low:"$1,800",mid:"$2,600",high:"$3,500"},
                    {cat:"Activities",low:"$600",mid:"$1,000",high:"$1,400"},
                    {cat:"Ground Transport",low:"$800",mid:"$900",high:"$1,100"},
                    {cat:"Misc / Buffer",low:"$400",mid:"$700",high:"$800"},
                    {cat:"TOTAL",low:"$8,800",mid:"$12,200",high:"$18,300",bold:true},
                  ].map((row,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:row.bold?"none":"1px solid rgba(255,255,255,0.04)",borderTop:row.bold?"1px solid rgba(255,255,255,0.1)":"none",marginTop:row.bold?"4px":0}}>
                      <span style={{fontSize:"11px",color:row.bold?"#e2e8f0":"#64748b",fontFamily:M.mono,fontWeight:row.bold?"bold":"normal"}}>{row.cat}</span>
                      <div style={{display:"flex",gap:"14px"}}>
                        {[{v:row.low,k:"low"},{v:row.mid,k:"mid"},{v:row.high,k:"high"}].map(({v,k})=>(
                          <span key={k} style={{fontSize:"11px",color:budgetTier===k?tierColors[k]:"#334155",fontFamily:M.mono,minWidth:"50px",textAlign:"right",fontWeight:budgetTier===k&&row.bold?"bold":"normal"}}>{v}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </Card>
              </div>
              <div>
                <SectionLabel>City Cost Index (family of 4 / day all-in)</SectionLabel>
                <Card>
                  {[
                    {city:"🇩🇰 Copenhagen",range:"$420–580",l:5},
                    {city:"🇸🇪 Gothenburg",range:"$320–450",l:4},
                    {city:"🇸🇪 Stockholm",range:"$380–520",l:4},
                    {city:"🇫🇮 Helsinki",range:"$330–460",l:4},
                    {city:"🇪🇪 Tallinn",range:"$180–250",l:2},
                    {city:"🇱🇻 Riga",range:"$160–220",l:1},
                    {city:"🇱🇹 Vilnius",range:"$140–200",l:1},
                    {city:"🇳🇴 Bergen",range:"$440–580",l:5},
                    {city:"🇳🇴 Oslo",range:"$460–640",l:5},
                  ].map((c,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:"8px",padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                      <div style={{minWidth:"130px",fontSize:"11px",fontFamily:M.mono}}>{c.city}</div>
                      <div style={{display:"flex",gap:"2px"}}>{[1,2,3,4,5].map(n=><div key={n} style={{width:"14px",height:"4px",borderRadius:"2px",background:n<=c.l?(c.l>=5?"#f87171":c.l<=1?"#4ade80":"#60a5fa"):"rgba(255,255,255,0.08)"}}/>)}</div>
                      <div style={{fontSize:"11px",color:c.l>=5?"#f87171":c.l<=1?"#4ade80":"#60a5fa",fontFamily:M.mono,marginLeft:"auto"}}>{c.range}</div>
                    </div>
                  ))}
                </Card>
              </div>
            </div>

            <SectionLabel>Points Strategy</SectionLabel>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"14px"}}>
              {POINTS.map((p,i)=>(
                <Card key={i}>
                  <div style={{fontSize:"12px",fontWeight:"bold",marginBottom:"2px"}}>{p.prog}</div>
                  <div style={{fontSize:"11px",color:"#4ade80",fontFamily:M.mono,marginBottom:"8px"}}>Est. value: {p.saves}</div>
                  <div style={{fontSize:"11px",color:"#64748b",fontFamily:M.mono,lineHeight:1.7}}>{p.tip}</div>
                </Card>
              ))}
            </div>

            <div style={{background:"rgba(74,222,128,0.07)",border:"1px solid rgba(74,222,128,0.2)",borderRadius:"9px",padding:"14px"}}>
              <SectionLabel color="#4ade80">Bottom Line with Points Applied</SectionLabel>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"12px"}}>
                {Object.values(ROUTES).map(r=>(
                  <div key={r.id}>
                    <div style={{fontSize:"12px",fontWeight:"bold",marginBottom:"4px",fontFamily:M.mono}}>{r.emoji} Route {r.id}</div>
                    <div style={{fontSize:"11px",color:"#64748b",fontFamily:M.mono,lineHeight:1.8}}>
                      Cash mid: <span style={{color:"#60a5fa"}}>${r.budgetEst.mid.toLocaleString()}</span><br/>
                      Points savings: <span style={{color:"#4ade80"}}>~$3,500–4,500</span><br/>
                      Effective cost: <span style={{color:"#4ade80",fontWeight:"bold"}}>${(r.budgetEst.mid-4000).toLocaleString()}–${(r.budgetEst.mid-3500).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>
        )}

      </div>{/* end content area */}

      {/* Footer */}
      <div style={{padding:"8px 24px",borderTop:"1px solid rgba(255,255,255,0.06)",background:"rgba(0,0,0,0.2)",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
        <div style={{fontSize:"9px",color:"#1e293b",fontFamily:M.mono}}>ATLAS · Nordic 2025 · {DESTINATIONS.length} destinations · 5 countries · Routes A–C</div>
        <div style={{fontSize:"9px",color:"#1e293b",fontFamily:M.mono}}>Next: rank your must-haves → build the final day-by-day</div>
      </div>
    </div>
  );
}
