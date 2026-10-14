import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface RawShaheed {
  sNo: number;
  name: string;
  rank: string;
  dateOfShahadat: string; // DD.MM.YYYY
  unit: string;
  residency: string;
  contactNo: string;
}

export const SHUHADA_RECORDS: RawShaheed[] = [
  // Page 1 (1 to 42)
  { sNo: 1, name: "Gul Akhtar, 722", rank: "FC", dateOfShahadat: "24.05.1982", unit: "District Police", residency: "Basti Dhapana Wali", contactNo: "0313-770-2501" },
  { sNo: 2, name: "Abdur Rahim,856", rank: "FC", dateOfShahadat: "17.04.1987", unit: "District Police", residency: "Village Rehmani Khel", contactNo: "0343-936-3364" },
  { sNo: 3, name: "Daulat Khan,656", rank: "FC", dateOfShahadat: "30.09.1988", unit: "Other District", residency: "Bakhmal Ahmad Zai. District Lakki Marwat", contactNo: "0344-934-5811" },
  { sNo: 4, name: "Ghulam Abid No.3017/FRP", rank: "FC", dateOfShahadat: "26.06.1995", unit: "FRP Police", residency: "Basti Dewala", contactNo: "0345-988-9895" },
  { sNo: 5, name: "Riaz Hussain,838", rank: "FC", dateOfShahadat: "13.01.1997", unit: "District Police", residency: "Village Makkar", contactNo: "0346-949-3856" },
  { sNo: 6, name: "Zerdad Khan,621", rank: "FC", dateOfShahadat: "02.06.1997", unit: "District Police", residency: "Village Gilloti", contactNo: "0346-951-2071" },
  { sNo: 7, name: "Qamar Abbas,782", rank: "FC", dateOfShahadat: "01.07.1998", unit: "Other District", residency: "Jhalar Sikandar, Village Dajil, District Bhakkar", contactNo: "0333-890-2672" },
  { sNo: 8, name: "Naimat Ullah No.1151/FRP", rank: "FC", dateOfShahadat: "13.09.1998", unit: "FRP Police", residency: "Village Maddi now Khan Velley, Muryali", contactNo: "0346-524-5190" },
  { sNo: 9, name: "Gulzar Hussain,457", rank: "FC", dateOfShahadat: "29.10.1998", unit: "District Police", residency: "Village Muryali", contactNo: "0344-895-2912" },
  { sNo: 10, name: "Muhammad Shafi,785", rank: "HC", dateOfShahadat: "20.07.1999", unit: "District Police", residency: "Village Abdul Khel", contactNo: "0313-934-1911" },
  { sNo: 11, name: "Muhammad Mushtaq,615", rank: "FC", dateOfShahadat: "20.07.1999", unit: "Other District", residency: "Adda Murani Shumali , Darya Khan District Bhakkar", contactNo: "0300-403-2023" },
  { sNo: 12, name: "Hassan Ali Shah, 633", rank: "FC", dateOfShahadat: "28.09.1999", unit: "District Police", residency: "Village Katghar", contactNo: "0346-785-8672" },
  { sNo: 13, name: "Muhammad Hanif, 422", rank: "LHC", dateOfShahadat: "23.10.1999", unit: "District Police", residency: "Near Masjid Abu Huraira, Bakhtawar Abad", contactNo: "0346-986-4903" },
  { sNo: 14, name: "Ejaz Ahmad Langrial", rank: "SSP", dateOfShahadat: "07.05.2001", unit: "Other District", residency: "House No. 133-B, NesPak Phase 2, Canal Bank Road, Lahore", contactNo: "0334-405-0906" },
  { sNo: 15, name: "Ghulam Qambar/FRP", rank: "Inspector", dateOfShahadat: "13.09.2001", unit: "FRP Police", residency: "Basti Diwala", contactNo: "0334-722-8414" },
  { sNo: 16, name: "Rab Nawaz, 1016", rank: "HC", dateOfShahadat: "13.09.2001", unit: "District Police", residency: "Subhan Town, Basti Mahiyar", contactNo: "0349-892-4922" },
  { sNo: 17, name: "Nek Nawaz Khan", rank: "DSP", dateOfShahadat: "19.10.2002", unit: "Other District", residency: "Kotka Kathar, Distt: Bannu", contactNo: "0346-927-7585" },
  { sNo: 18, name: "Abdul Haleem, 616", rank: "LHC", dateOfShahadat: "06.04.2003", unit: "District Police", residency: "Village Paniala", contactNo: "0346-918-0986" },
  { sNo: 19, name: "Zard Ali, 295", rank: "FC", dateOfShahadat: "06.04.2003", unit: "Other District", residency: "Chuar Khel Pezu, District Lakki Marwat", contactNo: "0344-898-6206" },
  { sNo: 20, name: "Ali Muhammad, 944", rank: "LHC", dateOfShahadat: "01.07.2003", unit: "District Police", residency: "Wanda Sher Khan", contactNo: "0345-983-1539" },
  { sNo: 21, name: "Abdul Sattar Shah, D/12", rank: "ASI", dateOfShahadat: "01.07.2003", unit: "Other District", residency: "Dara Pezu Distt: Lakki Marwat", contactNo: "0346-950-8389" },
  { sNo: 22, name: "Allah Noor", rank: "SI", dateOfShahadat: "30.07.2003", unit: "Other District", residency: "Pezu Distt: Lakki Marwat", contactNo: "0345-989-1150" },
  { sNo: 23, name: "Rajab Ali Shah", rank: "DSP", dateOfShahadat: "21.12.2003", unit: "District Police", residency: "Chah Said Munawar Shah", contactNo: "0333-996-6008" },
  { sNo: 24, name: "Ghulam Yasin, 185", rank: "LHC", dateOfShahadat: "22.09.2004", unit: "District Police", residency: "Basti Maheer", contactNo: "0344-935-5751" },
  { sNo: 25, name: "Badr-ud-Din, 815", rank: "FC", dateOfShahadat: "03.11.2004", unit: "Other District", residency: "Chuar Khel Pezu District Lakki Marwat", contactNo: "0342-933-9026" },
  { sNo: 26, name: "Nasir Ali Shah, 235", rank: "FC", dateOfShahadat: "19.03.2006", unit: "District Police", residency: "Village Kalagorh", contactNo: "0345-982-8957" },
  { sNo: 27, name: "Muhammad Khan,1316", rank: "FC", dateOfShahadat: "19.03.2006", unit: "District Police", residency: "Village Katta Khel", contactNo: "0342-937-5554" },
  { sNo: 28, name: "Banat Gul,816", rank: "ASI", dateOfShahadat: "19.03.2006", unit: "District Police", residency: "Village Gilloti", contactNo: "0345-978-0867" },
  { sNo: 29, name: "Bashir Hussain Shah,", rank: "ASI", dateOfShahadat: "18.01.2007", unit: "District Police", residency: "Village Makkar", contactNo: "0341-448-0275" },
  { sNo: 30, name: "Abdul Aleem No.6074/FRP", rank: "FC", dateOfShahadat: "29.01.2007", unit: "FRP Police", residency: "Near Didawar Public School, Barkat Abad Muryali", contactNo: "0347-984-5645" },
  { sNo: 31, name: "Hafiz M.Bakhsh No.6204/FRP", rank: "FC", dateOfShahadat: "15.07.2007", unit: "FRP Police", residency: "Village Muryali", contactNo: "0345-983-4391" },
  { sNo: 32, name: "Mohammad Sharif No.6011/FRP", rank: "FC", dateOfShahadat: "15.07.2007", unit: "FRP Police", residency: "Fazal Rahim Colony near Ameer Hamza Masjid", contactNo: "0310-836-7887" },
  { sNo: 33, name: "Shah Jehan No. 631", rank: "ASI", dateOfShahadat: "15.07.2007", unit: "District Police", residency: "Shah Jehan Shaheed Town", contactNo: "0344-937-4023" },
  { sNo: 34, name: "Habibullah No. 1056", rank: "HC", dateOfShahadat: "15.07.2007", unit: "District Police", residency: "Shah Alam Abad Chowk", contactNo: "0344-895-6558" },
  { sNo: 35, name: "Mohammad Bakhsh No. 206", rank: "FC", dateOfShahadat: "15.07.2007", unit: "District Police", residency: "Zaffar Abad", contactNo: "0345-984-7867" },
  { sNo: 36, name: "Ghulam Jillani No. 815", rank: "FC", dateOfShahadat: "15.07.2007", unit: "District Police", residency: "Village Jabbar wala", contactNo: "0344-418-6438" },
  { sNo: 37, name: "Tanveer Hussain Shah No. 846", rank: "HC", dateOfShahadat: "15.07.2007", unit: "District Police", residency: "Kotla Qaim Shah", contactNo: "0346-799-7114" },
  { sNo: 38, name: "Khizar Hayat No. 1008", rank: "HC", dateOfShahadat: "15.07.2007", unit: "District Police", residency: "Gali Dabba Tabakhi", contactNo: "0344-936-1013" },
  { sNo: 39, name: "Naimat Ullah No.1106", rank: "FC", dateOfShahadat: "15.07.2007", unit: "District Police", residency: "Jhoke Khalar", contactNo: "0345-984-7751" },
  { sNo: 40, name: "Fida Hussain No. 42/D", rank: "SI", dateOfShahadat: "15.07.2007", unit: "District Police", residency: "Hazara Paka", contactNo: "0346-710-4316" },
  { sNo: 41, name: "Imam Bakhsh No. 01", rank: "HC", dateOfShahadat: "15.07.2007", unit: "District Police", residency: "Village Qazi Khokar", contactNo: "0341-684-1807" },
  { sNo: 42, name: "Irshad Hussain No. 1123 (Driver)", rank: "FC", dateOfShahadat: "15.07.2007", unit: "District Police", residency: "Village Sighri Mitwala Shah", contactNo: "0302-316-9077" },

  // Page 2 (43 to 86)
  { sNo: 43, name: "Mohammad Imran No. 1226", rank: "FC", dateOfShahadat: "15.07.2007", unit: "District Police", residency: "Village Qazi Khokhar ( Lodhra )", contactNo: "0345-983-1064" },
  { sNo: 44, name: "Ehsan Ullah No. 1468", rank: "FC", dateOfShahadat: "15.07.2007", unit: "District Police", residency: "Wandha Kareem Khan", contactNo: "0346-785-9903" },
  { sNo: 45, name: "Amanullah No. 299/ Driver", rank: "FC", dateOfShahadat: "15.07.2007", unit: "District Police", residency: "Chah Pippal Wala", contactNo: "0345-988-9426" },
  { sNo: 46, name: "Mohammad Yousaf No. 24/D", rank: "ASI", dateOfShahadat: "19.07.2007", unit: "District Police", residency: "Dar City, New Bannu Chungi", contactNo: "0346-097-6185" },
  { sNo: 47, name: "Mohammad Yaqoob No. 1021", rank: "FC", dateOfShahadat: "20.08.2007", unit: "District Police", residency: "Gilani Town", contactNo: "0348-990-1316" },
  { sNo: 48, name: "Shaid Saleem No. 1278", rank: "FC", dateOfShahadat: "11.09.2007", unit: "District Police", residency: "Moh: Qasaban", contactNo: "0345-983-8849" },
  { sNo: 49, name: "Mohammad Khalid No. 925", rank: "HC", dateOfShahadat: "11.09.2007", unit: "District Police", residency: "Chah Ghulamy wala", contactNo: "0344-940-1529" },
  { sNo: 50, name: "Haibat Ali (District Lakki Marwat Shaheed)", rank: "Inspector", dateOfShahadat: "04.10.2007", unit: "Other District", residency: "Moh: Jogian Wala", contactNo: "0341-977-6895" },
  { sNo: 51, name: "Fazal-ur-Rehman No.1637", rank: "FC", dateOfShahadat: "15.12.2007", unit: "District Police", residency: "Village Kata Khel", contactNo: "0346-595-6232" },
  { sNo: 52, name: "Qismat Ullah No.6828/FRP", rank: "FC", dateOfShahadat: "25.05.2008", unit: "FRP Police", residency: "Street Qayyum Hassan, Zaffar Abad Colony,", contactNo: "0344-863-8619" },
  { sNo: 53, name: "Syed Zafar Ali No.2570/FRP", rank: "FC", dateOfShahadat: "06.06.2008", unit: "FRP Police", residency: "Chah Syed Munawar", contactNo: "0344-939-7152" },
  { sNo: 54, name: "Khadim Hussain,", rank: "ASI", dateOfShahadat: "06.06.2008", unit: "District Police", residency: "Village Himmat", contactNo: "0346-555-8780" },
  { sNo: 55, name: "Fateh Hussain No.445", rank: "FC", dateOfShahadat: "06.06.2008", unit: "District Police", residency: "Village Ameer Shah", contactNo: "0345-983-1209" },
  { sNo: 56, name: "Waheed Mumtaz, 301", rank: "FC", dateOfShahadat: "06.06.2008", unit: "District Police", residency: "Najaf Abad Colony", contactNo: "0345-906-4573" },
  { sNo: 57, name: "Syed Waqar Ali No.2063/FRP", rank: "FC", dateOfShahadat: "19.08.2008", unit: "FRP Police", residency: "Chah Syed Munawar", contactNo: "0348-948-6507" },
  { sNo: 58, name: "Munawar Hussain No.58", rank: "FC", dateOfShahadat: "19.08.2008", unit: "District Police", residency: "Chah Syed Munawar Shah", contactNo: "0345-984-0345" },
  { sNo: 59, name: "Muhammad Billal No.1774", rank: "FC", dateOfShahadat: "19.08.2008", unit: "District Police", residency: "Village Rohalla", contactNo: "0346-989-0625" },
  { sNo: 60, name: "Ejaz Hussain No. 595", rank: "HC", dateOfShahadat: "04.01.2009", unit: "District Police", residency: "Chah Munshi Wala", contactNo: "0334-485-4388" },
  { sNo: 61, name: "Mohammad Rashid No. 64", rank: "FC", dateOfShahadat: "04.01.2009", unit: "District Police", residency: "Dar City, New Bannu Chungi", contactNo: "0332-723-7891" },
  { sNo: 62, name: "Allah Nawaz No. 24/D", rank: "SI", dateOfShahadat: "04.01.2009", unit: "District Police", residency: "Khayaban Habib Colony, near Pak Pearl College, Qureshi Turn, DIKhan", contactNo: "0341-393-2363" },
  { sNo: 63, name: "Faheem Abbas, 1253/FRP", rank: "FC", dateOfShahadat: "11.03.2009", unit: "FRP Police", residency: "Moh: Latoo Faqir", contactNo: "0346-912-3010" },
  { sNo: 64, name: "Mohammad Iqbal No. 641", rank: "FC", dateOfShahadat: "17.05.2009", unit: "District Police", residency: "Village Pota", contactNo: "0345-374-3232" },
  { sNo: 65, name: "Sajid Ali, 2449 ( Elite Force )", rank: "FC", dateOfShahadat: "28.05.2009", unit: "Elite Police", residency: "Village Budni, Warsak GT Road, Peshawar", contactNo: "0314-949-7308" },
  { sNo: 66, name: "Shah Alam No.1997/FRP", rank: "FC", dateOfShahadat: "29.05.2009", unit: "FRP Police", residency: "Gari Sadozai", contactNo: "0346-787-9755" },
  { sNo: 67, name: "Saleem Ullah No.2014/FRP", rank: "FC", dateOfShahadat: "12.06.2009", unit: "FRP Police", residency: "Sharqi Khel, Paniala.", contactNo: "0345-764-5125" },
  { sNo: 68, name: "Zulfaqar Haider No.1114", rank: "HC", dateOfShahadat: "17.07.2009", unit: "District Police", residency: "Bakhtawar Abad, near Kotli Imam", contactNo: "0344-936-7769" },
  { sNo: 69, name: "Asad Abbas No.1654", rank: "FC", dateOfShahadat: "29.07.2009", unit: "District Police", residency: "Thala Bamoun Shah", contactNo: "0336-703-6122" },
  { sNo: 70, name: "Niaz Hussain No. 5774/ESM (Badaber, Peshawar Shaheed)", rank: "FC", dateOfShahadat: "17.03.2010", unit: "Other District", residency: "Bilot Sharif, Tehsil Paharpur", contactNo: "0315-190-7960" },
  { sNo: 71, name: "Muhammad Iqbal", rank: "DSP", dateOfShahadat: "18.05.2010", unit: "District Police", residency: "Najaf Abad Colony", contactNo: "0344-937-3575" },
  { sNo: 72, name: "Muhammad Mushtaq, 455", rank: "FC", dateOfShahadat: "18.05.2010", unit: "District Police", residency: "Village New Chura", contactNo: "0334-722-3153" },
  { sNo: 73, name: "Muhammad Irshad, 1215", rank: "FC", dateOfShahadat: "18.05.2010", unit: "District Police", residency: "Moh: Siraj Khel, Paniala.", contactNo: "0340-570-0481" },
  { sNo: 74, name: "Muhammad Daoud, 320", rank: "FC", dateOfShahadat: "19.08.2010", unit: "District Police", residency: "Basti Diwala", contactNo: "0346-540-5965" },
  { sNo: 75, name: "Asmat Ullah, 513", rank: "FC", dateOfShahadat: "19.08.2010", unit: "Other District", residency: "Mullazai District Tank", contactNo: "0342-213-4991" },
  { sNo: 76, name: "Nawab Khan", rank: "SI", dateOfShahadat: "10.12.2010", unit: "Other District", residency: "Saray Norang, District Lakki Marwat", contactNo: "0300-534-8192" },
  { sNo: 77, name: "Syed Kamal Shah. 1298 ( Elite Force )", rank: "FC", dateOfShahadat: "13.12.2010", unit: "Elite Police", residency: "H#G-08, Ghaznawi Colony Bypass Canal Road, District Mardan", contactNo: "0310-500-5001" },
  { sNo: 78, name: "Naseer-ud-Din,612", rank: "HC", dateOfShahadat: "30.01.2011", unit: "District Police", residency: "Basti Ustrana Shumali", contactNo: "0342-983-1247" },
  { sNo: 79, name: "Syed Asif Ali,1742", rank: "FC", dateOfShahadat: "21.04.2011", unit: "District Police", residency: "Basti Kanchkain Wali", contactNo: "0345-982-3645" },
  { sNo: 80, name: "Mohammad Hanif,1367", rank: "FC", dateOfShahadat: "21.04.2011", unit: "District Police", residency: "Village Ghara Sanghi, Paroa", contactNo: "0344-895-3296" },
  { sNo: 81, name: "Safdar Waqar, 1773", rank: "FC", dateOfShahadat: "01.05.2011", unit: "District Police", residency: "Village Dhap Shumali", contactNo: "0347-973-8301" },
  { sNo: 82, name: "Murid Akbar (District Tank Shaheed)", rank: "SI", dateOfShahadat: "30.05.2011", unit: "Other District", residency: "Moh: Sultania Paharpur", contactNo: "0342-936-2306" },
  { sNo: 83, name: "Allawal Khan,48/D", rank: "SI", dateOfShahadat: "25.06.2011", unit: "District Police", residency: "Village Dhalla, Paharpur", contactNo: "0346-786-4348" },
  { sNo: 84, name: "Akbar Zaman,608/Driver", rank: "HC", dateOfShahadat: "25.06.2011", unit: "District Police", residency: "Gulshan-e- Jamil Colony, Diyal Road", contactNo: "0341-789-8855" },
  { sNo: 85, name: "Abdur Rehman,759", rank: "LHC", dateOfShahadat: "25.06.2011", unit: "District Police", residency: "New Bannu Chungi, Baloch Street", contactNo: "0336-511-1389" },
  { sNo: 86, name: "Mohammad Tariq,301", rank: "HC", dateOfShahadat: "25.06.2011", unit: "District Police", residency: "Kot Essa Khan", contactNo: "0346-785-3183" },

  // Page 3 (87 to 130)
  { sNo: 87, name: "Wahid Shah, 3076 (ESM)", rank: "FC", dateOfShahadat: "25.06.2011", unit: "Other District", residency: "Qazi Khel Qudeem District Charsada", contactNo: "0315-980-2982" },
  { sNo: 88, name: "Zahid Ullah, 2633 (ESM)", rank: "FC", dateOfShahadat: "25.06.2011", unit: "Other District", residency: "Gujrano Kali District Charsada", contactNo: "0344-452-0484" },
  { sNo: 89, name: "Habib Ullah, 10/D", rank: "SI", dateOfShahadat: "25.06.2011", unit: "Other District", residency: "Village Chuar Khel District Lakki Marwat", contactNo: "0346-949-7549" },
  { sNo: 90, name: "Sohail Abbas No.909/FRP", rank: "FC", dateOfShahadat: "25.08.2011", unit: "FRP Police", residency: "Basti Dewala", contactNo: "0334-722-6905" },
  { sNo: 91, name: "Rashid Irfan, 1465", rank: "FC", dateOfShahadat: "23.09.2011", unit: "District Police", residency: "Near Madrassa Qari Qasim", contactNo: "0334-723-8597" },
  { sNo: 92, name: "Abdul Karim, 1192", rank: "LHC", dateOfShahadat: "08.10.2011", unit: "District Police", residency: "Indus Colony, near Masjid Abu Bakar", contactNo: "0346-784-2329" },
  { sNo: 93, name: "Mohammad Jan,1599", rank: "FC", dateOfShahadat: "23.11.2011", unit: "District Police", residency: "Village Kulachi now Basti Dirkhana Wali.", contactNo: "0346-558-1264" },
  { sNo: 94, name: "Mohammad Akram", rank: "ASI", dateOfShahadat: "23.11.2011", unit: "District Police", residency: "Village Maddi", contactNo: "0344-711-8630" },
  { sNo: 95, name: "Mohammad Ismail, 465", rank: "FC", dateOfShahadat: "14.01.2012", unit: "District Police", residency: "Village Paniala", contactNo: "0343-983-5335" },
  { sNo: 96, name: "Mohammad Jahangir,702", rank: "FC", dateOfShahadat: "28.01.2012", unit: "District Police", residency: "Dar City / Basti Ghayan Wali", contactNo: "0321-960-5806" },
  { sNo: 97, name: "Mohammad Ramzan,723", rank: "FC", dateOfShahadat: "10.10.2012", unit: "District Police", residency: "Village Chumb, Paroa", contactNo: "0346-787-3518" },
  { sNo: 98, name: "Painda Khan, 1066", rank: "FC", dateOfShahadat: "13.10.2012", unit: "District Police", residency: "Village Kirri Bakhtiar, Daraban", contactNo: "0344-936-8217" },
  { sNo: 99, name: "Saif Ullah No.7757/FRP", rank: "FC", dateOfShahadat: "29.07.2013", unit: "FRP Police", residency: "Moh: Dhaidhi, Paniala", contactNo: "0344-546-2811" },
  { sNo: 100, name: "Mazhar Qureshi,698", rank: "HC", dateOfShahadat: "29.07.2013", unit: "District Police", residency: "Moh: Jumma Shah", contactNo: "0333-995-2800" },
  { sNo: 101, name: "Mir Zaman,2459 ESM", rank: "HC", dateOfShahadat: "29.07.2013", unit: "District Police", residency: "Khiyaban-e-Khyber Colony", contactNo: "0345-977-0061" },
  { sNo: 102, name: "Rustam Khan,4091 ESM", rank: "FC", dateOfShahadat: "29.07.2013", unit: "District Police", residency: "Rehmani Khel Paniala", contactNo: "0346-638-6201" },
  { sNo: 103, name: "Piao Sardar ESM", rank: "ASI", dateOfShahadat: "29.07.2013", unit: "Other District", residency: "Yaghi Niazi Khel, District Karak", contactNo: "0345-568-5523" },
  { sNo: 104, name: "Mohammad Anwar Shah, 1589", rank: "FC", dateOfShahadat: "16.10.2013", unit: "District Police", residency: "Village Kulachi", contactNo: "0346-196-5886" },
  { sNo: 105, name: "Sajjad Noroz ,1828", rank: "FC", dateOfShahadat: "23.10.2013", unit: "District Police", residency: "Moh: Ibrahim Zai, Kulachi", contactNo: "0344-937-1299" },
  { sNo: 106, name: "Abid Ali,1944", rank: "FC", dateOfShahadat: "16.11.2013", unit: "District Police", residency: "Village Muqeem Shah, Shor Kot", contactNo: "0341-796-9586" },
  { sNo: 107, name: "Mohammad Jamil", rank: "ASI", dateOfShahadat: "27.01.2014", unit: "District Police", residency: "Falak Abad, Kachi Paind Khan", contactNo: "0346-787-2416" },
  { sNo: 108, name: "Najeeb ur Rehman No.3816/Elite Force", rank: "FC", dateOfShahadat: "09.02.2014", unit: "Elite Police", residency: "Shah Hassan Khel, Paniala.", contactNo: "0348-589-0605" },
  { sNo: 109, name: "Naseer ud Din No.7806/FRP", rank: "FC", dateOfShahadat: "11.02.2014", unit: "FRP Police", residency: "Abdul Khel, Paniala", contactNo: "0315-222-8312" },
  { sNo: 110, name: "Tanveer Akhtar, 291", rank: "HC", dateOfShahadat: "11.02.2014", unit: "Other District", residency: "H#166, Block D-, Street#03, Gulshan-e-Madina, District Bhakkar", contactNo: "0348-621-9863" },
  { sNo: 111, name: "Ehsan Ullah, 675", rank: "HC", dateOfShahadat: "01.03.2014", unit: "District Police", residency: "Village Kat Shahani Malana", contactNo: "0344-939-7303" },
  { sNo: 112, name: "Mohammad Ilyas No.8024/FRP", rank: "FC", dateOfShahadat: "11.03.2014", unit: "FRP Police", residency: "Farooq Azam Town", contactNo: "0345-983-1815" },
  { sNo: 113, name: "Mohammad Idrees No. 7468/FRP", rank: "FC", dateOfShahadat: "11.03.2014", unit: "FRP Police", residency: "Wandha Madat, Paniala", contactNo: "0345-978-2390" },
  { sNo: 114, name: "Dilawar Khan No.7414/FRP", rank: "FC", dateOfShahadat: "17.03.2014", unit: "FRP Police", residency: "Gara Meherban, Daraban", contactNo: "0346-787-3208" },
  { sNo: 115, name: "Hidayat Ullah, 245", rank: "FC", dateOfShahadat: "21.03.2014", unit: "District Police", residency: "Shah Hassan Khel, Paniala.", contactNo: "0344-293-5708" },
  { sNo: 116, name: "Mohammad Nawaz No. 525", rank: "HC", dateOfShahadat: "27.04.2014", unit: "District Police", residency: "Eid Gah Kalan DIKhan", contactNo: "0315-934-2586" },
  { sNo: 117, name: "Naseem Abbas No.732 / CTD", rank: "FC", dateOfShahadat: "23.07.2014", unit: "CTD Police", residency: "Street Mangla Medical Store, near Noor Masjid", contactNo: "0347-932-9737" },
  { sNo: 118, name: "Mohammad Ramzan,1686", rank: "FC", dateOfShahadat: "17.08.2014", unit: "District Police", residency: "Street Farid Khan Katti Khel, Old Nadra Office, Daraban Road", contactNo: "0344-939-9172" },
  { sNo: 119, name: "Mohammad Zahid,1344", rank: "FC", dateOfShahadat: "12.11.2014", unit: "District Police", residency: "Naqshband Town, Diyal Road", contactNo: "0347-109-7826" },
  { sNo: 120, name: "Mohammad Asif No.8037/FRP", rank: "FC", dateOfShahadat: "20.12.2014", unit: "FRP Police", residency: "Basti Haidar Abad, Paharpur", contactNo: "0340-367-1839" },
  { sNo: 121, name: "Mohammad Suleman,1296", rank: "FC", dateOfShahadat: "05.01.2015", unit: "District Police", residency: "Ejaz Abad, Muryali", contactNo: "0346-004-0044" },
  { sNo: 122, name: "Mamoon ur Rasheed No.7269/FRP", rank: "FC", dateOfShahadat: "08.01.2015", unit: "FRP Police", residency: "Village Pota now Kot Eassa Khan, Hathala.", contactNo: "0345-987-3968" },
  { sNo: 123, name: "Qaisar Jahan No.529 / CTD", rank: "HC", dateOfShahadat: "14.01.2015", unit: "CTD Police", residency: "Moh: Wakeelan Wala", contactNo: "0331-036-0950" },
  { sNo: 124, name: "Bahawal Khan DSP/HQrs:", rank: "Inspector", dateOfShahadat: "03.04.2015", unit: "District Police", residency: "Zaffar Abad", contactNo: "0341-726-7133" },
  { sNo: 125, name: "Mohammad Azam,537", rank: "FC", dateOfShahadat: "28.05.2015", unit: "District Police", residency: "Al-Karam City, near White Rose Marriage Hall, Daraban Road", contactNo: "0341-462-9896" },
  { sNo: 126, name: "Munir Ahmad No.7742/FRP", rank: "FC", dateOfShahadat: "28.05.2015", unit: "FRP Police", residency: "Village Shor Kot", contactNo: "0345-988-8253" },
  { sNo: 127, name: "Ameer Nawaz No.3679 /Elite Force", rank: "FC", dateOfShahadat: "18.07.2015", unit: "Elite Police", residency: "Moh: Siraj Khel, Village Paniala", contactNo: "0344-907-0870" },
  { sNo: 128, name: "Shahjehan, 1315", rank: "FC", dateOfShahadat: "05.09.2015", unit: "District Police", residency: "Eid Gah Muryali", contactNo: "0346-722-6292" },
  { sNo: 129, name: "Zeshan Haider, 1499", rank: "FC", dateOfShahadat: "06.09.2015", unit: "District Police", residency: "Basti Diwala, DIKhan", contactNo: "0345-974-3416" },
  { sNo: 130, name: "Khizar Abbas No. 1000", rank: "HC", dateOfShahadat: "10.09.2015", unit: "Other District", residency: "Jhalar Sikandar Khan District Bhakkar", contactNo: "0333-684-4590" },

  // Page 4 (131 to 174)
  { sNo: 131, name: "Azhar Hussain No. 940", rank: "HC", dateOfShahadat: "19.03.2016", unit: "District Police", residency: "Ijaz Abad Muryali", contactNo: "0345-242-5044" },
  { sNo: 132, name: "Faisal Rehman No. 731", rank: "FC", dateOfShahadat: "23.03.2016", unit: "District Police", residency: "Near SI Fazal Elahi House, Basti Naad Ali Shah", contactNo: "0331-798-7032" },
  { sNo: 133, name: "Muhammad Imran No. 1887", rank: "FC", dateOfShahadat: "23.03.2016", unit: "District Police", residency: "Saeed Abad Madni Town", contactNo: "0346-888-6007" },
  { sNo: 134, name: "Tariq Jamshed No. 530", rank: "HC", dateOfShahadat: "15.06.2016", unit: "District Police", residency: "Thoya Siyal, DIKhan and Zameer Abad, DIKhan", contactNo: "0346-888-7035" },
  { sNo: 135, name: "Shah Zaib No.7670/FRP", rank: "FC", dateOfShahadat: "30.06.2016", unit: "FRP Police", residency: "Madina Colony", contactNo: "0344-504-9138" },
  { sNo: 136, name: "Noor Mohammad Khan / CTD", rank: "DSP", dateOfShahadat: "30.06.2016", unit: "CTD Police", residency: "Khair Abad Colony", contactNo: "0346-784-2050" },
  { sNo: 137, name: "Irshad Hussain, 1932", rank: "FC", dateOfShahadat: "16.02.2017", unit: "District Police", residency: "Near Bhatti General Store, Kotli Imam", contactNo: "0340-710-6312" },
  { sNo: 138, name: "Rehmat Ullah Khan", rank: "ASI", dateOfShahadat: "16.02.2017", unit: "Other District", residency: "Village Churkin Taunsa District Dera Ghazi Khan", contactNo: "0344-821-0326" },
  { sNo: 139, name: "Mohammad Noman No. 7366/FRP", rank: "FC", dateOfShahadat: "16.02.2017", unit: "FRP Police", residency: "Near Masjid Hasnain, Kotli Imam", contactNo: "0342-911-3295" },
  { sNo: 140, name: "Rashid Iqbal No.7938/FRP", rank: "FC", dateOfShahadat: "16.02.2017", unit: "FRP Police", residency: "Long Khair Shah, Band Kurai.", contactNo: "0345-987-5143" },
  { sNo: 141, name: "Kamran Khan, 788", rank: "FC", dateOfShahadat: "20.04.2017", unit: "District Police", residency: "Moh: Wakilan Wala", contactNo: "0333-995-1816" },
  { sNo: 142, name: "Mohammad Waqas No.7365/FRP", rank: "FC", dateOfShahadat: "24.04.2017", unit: "FRP Police", residency: "Moh: Garhi Sadozai", contactNo: "0334-723-3028" },
  { sNo: 143, name: "Mohammad Kamran.2642/Elite Force", rank: "FC", dateOfShahadat: "24.06.2017", unit: "Elite Police", residency: "Street Mama Rehan,Eid Gah Kalan", contactNo: "0333-995-9880" },
  { sNo: 144, name: "Nasir Abbas Shah No. 864", rank: "FC", dateOfShahadat: "11.08.2017", unit: "District Police", residency: "Village Segri Matwala Shah", contactNo: "0344-895-1812" },
  { sNo: 145, name: "Ali Ammar Yasir No.279", rank: "FC", dateOfShahadat: "11.08.2017", unit: "District Police", residency: "Village Kathgarh, Paharpur", contactNo: "0342-704-1214" },
  { sNo: 146, name: "Sana Ullah No. 7383/FRP", rank: "FC", dateOfShahadat: "17.12.2017", unit: "FRP Police", residency: "Village Yarik", contactNo: "0348-882-4236" },
  { sNo: 147, name: "Wilayat Ullah No. 1701", rank: "LHC", dateOfShahadat: "04.02.2018", unit: "District Police", residency: "Near Zoo, Shor Kot", contactNo: "0303-894-9981" },
  { sNo: 148, name: "Tariq Abbas No. 424", rank: "LHC", dateOfShahadat: "28.03.2018", unit: "District Police", residency: "Bhatta Mor, Chah Patti Ban, Ameer City", contactNo: "0335-503-1208" },
  { sNo: 149, name: "Fakhrullah No. 376", rank: "FC", dateOfShahadat: "30.03.2018", unit: "District Police", residency: "Village Giloti", contactNo: "0344-956-3938" },
  { sNo: 150, name: "Mulazim Hussain No. 1194", rank: "LHC", dateOfShahadat: "30.03.2018", unit: "District Police", residency: "Moh: Toyan Wala", contactNo: "0343-990-0015" },
  { sNo: 151, name: "Ghulam Abbas No. 3815 /Elite Force", rank: "FC", dateOfShahadat: "30.03.2018", unit: "Elite Police", residency: "Wanda Mochianwala", contactNo: "0317-063-2876" },
  { sNo: 152, name: "Mohammad Arshad Nadeem No. 674 (Tele)", rank: "FC", dateOfShahadat: "14.05.2018", unit: "Telecommun:", residency: "Moh: Gariban", contactNo: "0333-995-7895" },
  { sNo: 153, name: "Hayat Ullah No. 35/50", rank: "HC", dateOfShahadat: "28.05.2018", unit: "District Police", residency: "Madni Town near Ayub Masjid DIKhan", contactNo: "0346-431-7225" },
  { sNo: 154, name: "Mohammad Imtiaz No.1694", rank: "FC", dateOfShahadat: "10.06.2018", unit: "District Police", residency: "Basti Ustaran Shumali.", contactNo: "0341-761-8658" },
  { sNo: 155, name: "Zaffar Ali No. 1741", rank: "LHC", dateOfShahadat: "26.06.2018", unit: "District Police", residency: "Basti Mekan Jaunbi", contactNo: "0343-896-0206" },
  { sNo: 156, name: "Dil Nawaz No. 8801/FRP", rank: "FC", dateOfShahadat: "22.07.2018", unit: "FRP Police", residency: "Near Abu Bakar Masjid, Wanda Mochian Wala.", contactNo: "0346-787-7164" },
  { sNo: 157, name: "Mohammad Bashir Khan No.1352", rank: "FC", dateOfShahadat: "31.07.2018", unit: "District Police", residency: "Gara Aashiq,Paroa", contactNo: "0345-631-1202" },
  { sNo: 158, name: "Ghulam Abbas No.913", rank: "LHC", dateOfShahadat: "31.07.2018", unit: "District Police", residency: "Village Naiwela, Paroa", contactNo: "0343-787-6632" },
  { sNo: 159, name: "Mohammad Nadeem. No.1671", rank: "LHC", dateOfShahadat: "22.10.2018", unit: "District Police", residency: "Moh: Majeed Abad, Zaffar Abad Colony", contactNo: "0341-875-0925" },
  { sNo: 160, name: "Mohammad Kamran No. 532 / CTD", rank: "LHC", dateOfShahadat: "29.01.2019", unit: "CTD Police", residency: "Iqbal Street, Eid Gah Kalan", contactNo: "0333-995-6133" },
  { sNo: 161, name: "Mohammad Javed No. 1417", rank: "FC", dateOfShahadat: "12.02.2019", unit: "District Police", residency: "Village Lunda Sharif", contactNo: "0344-937-2507" },
  { sNo: 162, name: "Mir Baz Khan No.1288", rank: "LHC", dateOfShahadat: "12.02.2019", unit: "District Police", residency: "Wanda Khani Koruna, Paniala.", contactNo: "0345-815-6122" },
  { sNo: 163, name: "Asif Nawaz No. 8456/P-158 / FRP", rank: "FC", dateOfShahadat: "12.02.2019", unit: "FRP Police", residency: "Village Rehmani Khel, Paniala", contactNo: "0341-985-4994" },
  { sNo: 164, name: "Arab Khan No. 568 / CTD", rank: "HC", dateOfShahadat: "15.03.2019", unit: "CTD Police", residency: "Village Hassani, Sheru Kohna", contactNo: "0343-371-4565" },
  { sNo: 165, name: "Jahangir No. 8426/FRP", rank: "FC", dateOfShahadat: "21.07.2019", unit: "FRP Police", residency: "Village Kurai", contactNo: "0346-785-9077" },
  { sNo: 166, name: "Inam Ullah No. 8379/FRP", rank: "FC", dateOfShahadat: "21.07.2019", unit: "FRP Police", residency: "Village Muryali", contactNo: "0346-360-6813" },
  { sNo: 167, name: "Khalil ur Rehman No. 5490 ( Elite Force )", rank: "FC", dateOfShahadat: "21.07.2019", unit: "Elite Police", residency: "Talash Diarat, Village Banga, District Lower Dir", contactNo: "0345-808-1329" },
  { sNo: 168, name: "Hidayat Ullah No. 204 ( Elite Force )", rank: "FC", dateOfShahadat: "21.07.2019", unit: "Elite Police", residency: "Talash Diarat, Village Banga, District Lower Dir", contactNo: "0345-297-8329" },
  { sNo: 169, name: "Noor Ali Shah No.1181 ( CTD Force )", rank: "HC", dateOfShahadat: "23.10.2019", unit: "CTD Police", residency: "Gara Budha PS/SMA District Tank", contactNo: "0348-964-9201" },
  { sNo: 170, name: "Yousif Khan, 1773", rank: "LHC", dateOfShahadat: "09.11.2019", unit: "District Police", residency: "Village Giloti", contactNo: "0343-989-3783" },
  { sNo: 171, name: "Mohammad Bilal, 1832", rank: "FC", dateOfShahadat: "09.11.2019", unit: "District Police", residency: "Usmania Chowk, Near Elahi Masjid, Zaffar Abad Colony", contactNo: "0340-116-8125" },
  { sNo: 172, name: "Abdul Ghafar, 134", rank: "HC", dateOfShahadat: "16.11.2019", unit: "District Police", residency: "Near Ahmad Bakers, Basti Dirkhana Wali", contactNo: "0349-765-9386" },
  { sNo: 173, name: "Inayat Ullah (Tank District Shaheed)", rank: "SI", dateOfShahadat: "19.12.2019", unit: "Other District", residency: "Indus Colony, Diyal Road", contactNo: "0340-973-7828" },
  { sNo: 174, name: "Wali Mohammad, 2007/L", rank: "FC", dateOfShahadat: "17.01.2020", unit: "District Police", residency: "Khoi Pewar, Khoi Bahara", contactNo: "0346-325-4678" },

  // Page 5 (175 to 218)
  { sNo: 175, name: "Riaz Hussain, 249", rank: "HC", dateOfShahadat: "18.02.2020", unit: "District Police", residency: "Village Paroa", contactNo: "0348-926-1019" },
  { sNo: 176, name: "Jalil Khan ( CTD Force )", rank: "Inspector", dateOfShahadat: "31.08.2020", unit: "CTD Police", residency: "Kotka Haq Nawaz, Nar Shakri Ullah, Bannu", contactNo: "0335-199-9536" },
  { sNo: 177, name: "Rafi Ullah,1052 ( CTD Force )", rank: "LHC", dateOfShahadat: "10.09.2020", unit: "CTD Police", residency: "Kotla Mala Khel, Nadir Ghulam Ali, Saray Norang, Tehsil & District Lakki Marwat", contactNo: "0316-910-6718" },
  { sNo: 178, name: "Qaisar Nawaz No. 3606/ESM", rank: "FC", dateOfShahadat: "30.12.2020", unit: "District Police", residency: "Bakhtawar Abad, near Kotli Imam", contactNo: "0343-199-2258" },
  { sNo: 179, name: "Dilawar Khan, 1086", rank: "FC", dateOfShahadat: "02.08.2021", unit: "District Police", residency: "Village Hathala, DIKhan.", contactNo: "0300-909-3433" },
  { sNo: 180, name: "Ikram Ullah No. 8598/FRP", rank: "FC", dateOfShahadat: "24.10.2021", unit: "FRP Police", residency: "Basti Kanera, near Masjid Sher Khan, Sheikh Yousif Adda", contactNo: "0345-212-6968" },
  { sNo: 181, name: "Mohammad Iqbal Anwar No. 981/FRP (Tank District Shaheed)", rank: "HC", dateOfShahadat: "11.12.2021", unit: "Other District", residency: "Wanda Mir Alam, Giloti", contactNo: "0345-035-4614" },
  { sNo: 182, name: "Fazal ur Rehman, 849", rank: "FC", dateOfShahadat: "16.12.2021", unit: "District Police", residency: "Village Katta Khel, Paniala", contactNo: "0345-985-6986" },
  { sNo: 183, name: "Zardad Khan, 2401/K", rank: "FC", dateOfShahadat: "08.01.2022", unit: "District Police", residency: "Village Dani Pota, Khoi Bahara", contactNo: "0346-730-4404" },
  { sNo: 184, name: "Khan Bahader, 2879 (ESM)", rank: "FC", dateOfShahadat: "25.02.2022", unit: "Other District", residency: "Wanda Zarif, P/O Sarai Gambila, District Lakki Marwat,", contactNo: "0340-917-3933" },
  { sNo: 185, name: "Fahim Ullah, 990", rank: "LHC", dateOfShahadat: "23.03.2022", unit: "District Police", residency: "Basti Tareen Abad Near Police Lines", contactNo: "0347-196-8393" },
  { sNo: 186, name: "Abdur Rauf, 1437", rank: "LHC", dateOfShahadat: "28.03.2022", unit: "District Police", residency: "Moh: Jafer Zai, Kulachi", contactNo: "0307-398-0137" },
  { sNo: 187, name: "Abdur Rehman, 651 (Driver)", rank: "FC", dateOfShahadat: "11.04.2022", unit: "Other District", residency: "Village Dajil, District Bhakkar", contactNo: "0322-624-2116" },
  { sNo: 188, name: "Mohammad Jamshed, 2650 / Elite Force", rank: "FC", dateOfShahadat: "11.04.2022", unit: "Elite Police", residency: "Basti Dirkhana Wali", contactNo: "0342-937-7324" },
  { sNo: 189, name: "Mohammad Kamran Ellahi, 3720 (Elite Force )", rank: "HC", dateOfShahadat: "11.04.2022", unit: "Elite Police", residency: "Moh: Faqir Ahmad Gul, Paharpur", contactNo: "0345-983-2884" },
  { sNo: 190, name: "Munawar Khan, 5835/ Elite Force", rank: "FC", dateOfShahadat: "11.04.2022", unit: "Elite Police", residency: "Moh: Qasim Abad, Kulachi", contactNo: "0342-959-1461" },
  { sNo: 191, name: "Mirza Ali, 3926 ( Elite Force )", rank: "FC", dateOfShahadat: "11.04.2022", unit: "Elite Police", residency: "Village Pai, PS/Gul Imam, District Tank.", contactNo: "0348-511-8803" },
  { sNo: 192, name: "Lutf ur Rehman, 7652/FRP ( District Lakki Marwat Shaheed )", rank: "FC", dateOfShahadat: "17.05.2022", unit: "Other District", residency: "Village Kata Khel, Paniala", contactNo: "0348-055-0610" },
  { sNo: 193, name: "Mohammad Ramzan", rank: "Inspector", dateOfShahadat: "19.05.2022", unit: "District Police", residency: "Village Muryali", contactNo: "0344-926-2827" },
  { sNo: 194, name: "Shoukat Ali, 462", rank: "HC", dateOfShahadat: "05.07.2022", unit: "District Police", residency: "Karlu Street, Thoya Siyal, Kachi Paind Khan", contactNo: "0334-721-2813" },
  { sNo: 195, name: "Habib Ullah, 850", rank: "FC", dateOfShahadat: "05.07.2022", unit: "District Police", residency: "Moh: Mirwan Khel, Near Lari Adda, Paniala", contactNo: "0312-839-9039" },
  { sNo: 196, name: "Zahoor ud Din, 1387/Driver", rank: "FC", dateOfShahadat: "02.09.2022", unit: "District Police", residency: "Moh: Faiz Abad, Daraban Kalan", contactNo: "0344-801-9683" },
  { sNo: 197, name: "Mohammad Imran, 8485/FRP ( District Tank Shaheed )", rank: "LHC", dateOfShahadat: "09.09.2022", unit: "Other District", residency: "Village Paniala", contactNo: "0346-784-7211" },
  { sNo: 198, name: "Saif ur Rehman, 8365/FRP", rank: "FC", dateOfShahadat: "26.09.2022", unit: "FRP Police", residency: "Moh: Tajzai, Kulachi.", contactNo: "0341-902-8662" },
  { sNo: 199, name: "Mohammad Aslam, 1025", rank: "FC", dateOfShahadat: "20.10.2022", unit: "District Police", residency: "Village Lunda Parra, Paroa", contactNo: "0344-751-2230" },
  { sNo: 200, name: "Hazrat Hussain, 2199/K", rank: "FC", dateOfShahadat: "30.10.2022", unit: "District Police", residency: "Village Sarwakai, District South Waziristan Upper now Basti Dirkhana Wali", contactNo: "0340-981-6956" },
  { sNo: 201, name: "Shah Wali, 2235/ESM", rank: "HC", dateOfShahadat: "14.12.2022", unit: "Other District", residency: "Rakha Sher Khan, Ghoriwala, Bannu.", contactNo: "0335-836-3873" },
  { sNo: 202, name: "Gul Baran, 7913/FRP", rank: "HC", dateOfShahadat: "23.01.2023", unit: "FRP Police", residency: "Moh: Malakhel, Daraban", contactNo: "0341-205-3741" },
  { sNo: 203, name: "Mohammad Haroon, 9249/FRP", rank: "FC", dateOfShahadat: "30.01.2023", unit: "FRP Police", residency: "Village Kata Khel, Paniala", contactNo: "0345-987-3299" },
  { sNo: 204, name: "Gul Faraz Khan, 2214/Buner", rank: "FC", dateOfShahadat: "08.03.2023", unit: "Other District", residency: "Village Karori Tehsil Khado Khel District Buner.", contactNo: "0341-103-6734" },
  { sNo: 205, name: "Dil Jan, 7774/FRP ( District Lakki Marwat Shaheed )", rank: "FC", dateOfShahadat: "13.03.2023", unit: "Other District", residency: "Village Rehmani Khel, Paniala", contactNo: "0343-224-0334" },
  { sNo: 206, name: "Syed Mubarak Shah, 4048/ESM", rank: "FC", dateOfShahadat: "19.07.2023", unit: "District Police", residency: "Wanda Khaliq Shah, Band Kurai", contactNo: "0342-099-4665" },
  { sNo: 207, name: "Ahmad Raza, 1440", rank: "FC", dateOfShahadat: "24.08.2023", unit: "District Police", residency: "Moh: Jatan Wala, Kulachi.", contactNo: "0346-807-1474" },
  { sNo: 208, name: "Sami Ullah, 1247", rank: "FC", dateOfShahadat: "11.09.2023", unit: "District Police", residency: "Village Maddi Kulachi, Now Basti Rait Wali", contactNo: "0344-939-2192" },
  { sNo: 209, name: "Nazar Khan, 3619/ESM", rank: "FC", dateOfShahadat: "18.09.2023", unit: "District Police", residency: "Village Takwara, Hathala.", contactNo: "0305-239-2680" },
  { sNo: 210, name: "Wakeel Zada, 4748/Elite, Buner", rank: "FC", dateOfShahadat: "08.10.2023", unit: "Elite Police", residency: "Village Kankoi, District Buner.", contactNo: "0345-923-0315" },
  { sNo: 211, name: "Mohammad Shakeel, 811", rank: "FC", dateOfShahadat: "25.10.2023", unit: "District Police", residency: "Village Kurai.", contactNo: "0344-755-2790" },
  { sNo: 212, name: "Sher Alam No. 9082/FRP", rank: "FC", dateOfShahadat: "28.10.2023", unit: "FRP Police", residency: "Village Mehrabi.", contactNo: "0344-000-6461" },
  { sNo: 213, name: "Rehmat Elahi, 3716/ESM", rank: "FC", dateOfShahadat: "07.11.2023", unit: "District Police", residency: "Hanif Town, Basti Mahiyar.", contactNo: "0340-979-0665" },
  { sNo: 214, name: "Khan Arif Jan, 3726/ESM", rank: "FC", dateOfShahadat: "07.11.2023", unit: "District Police", residency: "Village Sardari Wala, Kirri Khaisore.", contactNo: "0348-818-5773" },
  { sNo: 215, name: "Syed Jamil Ahmad Shah, 1120/Tele", rank: "FC", dateOfShahadat: "12.11.2023", unit: "Telecommun:", residency: "Moh: Muavia Nagar, Paharpur City", contactNo: "0345-982-5548" },
  { sNo: 216, name: "Abdul Rasheed, 303", rank: "FC", dateOfShahadat: "15.12.2023", unit: "Other District", residency: "Village Chuwar Khel, District Lakki Marwat.", contactNo: "0345-785-4227" },
  { sNo: 217, name: "Mansoor, 2417 (SWTD)", rank: "FC", dateOfShahadat: "05.02.2024", unit: "District Police", residency: "Upper South Waziristan, now Bilal Abad, DIKhan.", contactNo: "0341-933-7448" },
  { sNo: 218, name: "Mohammad Imran, 910", rank: "FC", dateOfShahadat: "05.02.2024", unit: "District Police", residency: "Moh: Noori Darbar, Kulachi.", contactNo: "0346-786-9089" },

  // Page 6 (219 to 262)
  { sNo: 219, name: "Mohammad Aslam, 770", rank: "FC", dateOfShahadat: "05.02.2024", unit: "District Police", residency: "Village Shakh Quli Khel District Lakki Marwat now Village Shor Kot, DIKhan.", contactNo: "0301-886-3292" },
  { sNo: 220, name: "Ghulam Farid, 269", rank: "FC", dateOfShahadat: "05.02.2024", unit: "Other District", residency: "Shero Khel, Moh: Mina Khel, Lakki Marwat.", contactNo: "0310-219-1811" },
  { sNo: 221, name: "Mohammad Idrees, 8050/FRP", rank: "FC", dateOfShahadat: "05.02.2024", unit: "FRP Police", residency: "Village Pota, Hathala.", contactNo: "0344-895-1838" },
  { sNo: 222, name: "Mohammad Javed, 9039/7831/FRP", rank: "FC", dateOfShahadat: "05.02.2024", unit: "FRP Police", residency: "Village Saggu Kalan Janubi, Daraban.", contactNo: "0313-538-5856" },
  { sNo: 223, name: "Hameed ul Haq, 1155/Elite", rank: "FC", dateOfShahadat: "05.02.2024", unit: "Elite Police", residency: "Village Mir Ali, Tehsil Razar District Swabi.", contactNo: "0342-896-2005" },
  { sNo: 224, name: "Kosar Ali, 1099/Elite", rank: "HC", dateOfShahadat: "05.02.2024", unit: "Elite Police", residency: "Village Kalu Khan, Tehsil Razar District Swabi.", contactNo: "0300-522-8259" },
  { sNo: 225, name: "Ehtaram Syed, 2588/Elite", rank: "FC", dateOfShahadat: "05.02.2024", unit: "Elite Police", residency: "Village Kalu Khan, Tehsil Razar District Swabi.", contactNo: "0345-431-3495" },
  { sNo: 226, name: "Rafi Ullah, 4940/Elite", rank: "FC", dateOfShahadat: "05.02.2024", unit: "Elite Police", residency: "Village Gadi Khel, Takh Nusrati District Karak.", contactNo: "0343-561-3606" },
  { sNo: 227, name: "Syed Mohammad Zeeshan Bukhari, 1619/Driver", rank: "FC", dateOfShahadat: "08.02.2024", unit: "District Police", residency: "Basti Dewala, DIKhan.", contactNo: "0342-254-8144" },
  { sNo: 228, name: "Ali Mohammad, 2511/Elite", rank: "FC", dateOfShahadat: "08.02.2024", unit: "Elite Police", residency: "Darbar Bari Kao, District Lower Dir", contactNo: "0346-812-2849" },
  { sNo: 229, name: "Mohammad Sabir, 4626/Elite", rank: "HC", dateOfShahadat: "08.02.2024", unit: "Elite Police", residency: "Village Kandu Shah, Talash, District Lower Dir", contactNo: "0344-977-8373" },
  { sNo: 230, name: "Sultan Yousif, 872/M/Elite", rank: "SI", dateOfShahadat: "08.02.2024", unit: "Elite Police", residency: "Village Kandu Shah, Talash, District Lower Dir", contactNo: "0302-947-0350" },
  { sNo: 231, name: "Israr Ahmad, 4140/Elite", rank: "FC", dateOfShahadat: "08.02.2024", unit: "Elite Police", residency: "Banda Gae, Timergara, District Lower Dir", contactNo: "0343-973-3119" },
  { sNo: 232, name: "Din Mohammad Khan (Levies Force)", rank: "ASI", dateOfShahadat: "10.02.2024", unit: "District Police", residency: "Village Darazinda, DIKhan.", contactNo: "0348-955-9468" },
  { sNo: 233, name: "Akbar Khan, 3265/ESM", rank: "FC", dateOfShahadat: "13.02.2024", unit: "Other District", residency: "Village Chini Khel, Mitha Khel, District Karak", contactNo: "0305-524-2194" },
  { sNo: 234, name: "Mohammad Bakhsh, 81/ESM", rank: "FC", dateOfShahadat: "12.03.2024", unit: "District Police", residency: "Jhowk Machi, Paroa, DIKhan.", contactNo: "0345-582-4549" },
  { sNo: 235, name: "Mir Ghulam, 808", rank: "HC", dateOfShahadat: "01.12.2024", unit: "District Police", residency: "Village Pir Ashab, Paharpur.", contactNo: "0319-938-9598" },
  { sNo: 236, name: "Abdul Rauf, 1935", rank: "FC", dateOfShahadat: "02.12.2024", unit: "District Police", residency: "Village Bigwani, Chah Malana, Paharpur.", contactNo: "0344-939-2077" },
  { sNo: 237, name: "Asmat Ullah, 1820", rank: "LHC", dateOfShahadat: "31.12.2024", unit: "District Police", residency: "Village Bali Shumali, Shor Kot.", contactNo: "0348-182-8309" },
  { sNo: 238, name: "Arshad Khan, 437", rank: "HC", dateOfShahadat: "15.01.2025", unit: "District Police", residency: "Khair Abad Colony, near Modern Public School.", contactNo: "0333-997-4049" },
  { sNo: 239, name: "Khan Badshah, 3085/ESM", rank: "FC", dateOfShahadat: "25.01.2025", unit: "Other District", residency: "Nar Sahib Khan Dalkhozai, Sarae Norang, Lakki Marwat", contactNo: "0345-989-0613" },
  { sNo: 240, name: "Mohammad Ali, 299", rank: "FC", dateOfShahadat: "17.03.2025", unit: "District Police", residency: "Village Maqbool Abad, Paharpur.", contactNo: "0331-861-7001" },
  { sNo: 241, name: "Javed Alam Gul, 56", rank: "HC", dateOfShahadat: "18.04.2025", unit: "District Police", residency: "Chah Phulay Wala, Muryali.", contactNo: "0341-654-0083" },
  { sNo: 242, name: "Rehmeen Khan", rank: "DSP", dateOfShahadat: "12.07.2025", unit: "Other District", residency: "Village Masto Khel, P/O Sada, District Kurram.", contactNo: "0333-485-8571" },
  { sNo: 243, name: "Ghulam Mohammad, 2379/ESM", rank: "HC", dateOfShahadat: "16.07.2025", unit: "District Police", residency: "Moh: Pir Khaki Shah, Paniala.", contactNo: "0347-990-9080" },
  { sNo: 244, name: "Shehzada, 5762/ESM", rank: "FC", dateOfShahadat: "16.07.2025", unit: "Other District", residency: "Village Machan Khel, Abba Khel, Tehsil & District Lakki Marwat", contactNo: "0345-985-4160" },
  { sNo: 245, name: "Mohammad Sohail Khan, 388", rank: "HC", dateOfShahadat: "02.08.2025", unit: "District Police", residency: "Village Giloti, Chunda.", contactNo: "0328-642-6719" },
  { sNo: 246, name: "Ahmad Nawaz, 04", rank: "LHC", dateOfShahadat: "08.10.2025", unit: "District Police", residency: "Village Arra now Basti Rait Wali, DIKhan", contactNo: "0345-987-1150" },
  { sNo: 247, name: "Mudassir Haleem, 09/7896", rank: "LHC", dateOfShahadat: "11.10.2025", unit: "District Police", residency: "Wanda Madat, Paniala.", contactNo: "0310-983-0864" },
  { sNo: 248, name: "Asmat Ullah", rank: "Langari", dateOfShahadat: "11.10.2025", unit: "District Police", residency: "Wanda Madat, Paniala.", contactNo: "0310-983-0864" },
  { sNo: 249, name: "Mohammad Jalal, 8307/FRP (Recruit)", rank: "FC", dateOfShahadat: "11.10.2025", unit: "FRP Police", residency: "Gara Rehman, Pusha Pull.", contactNo: "0340-576-4108" },
  { sNo: 250, name: "Anwar ul Hassan, 7916/FRP", rank: "FC", dateOfShahadat: "11.10.2025", unit: "FRP Police", residency: "Village Rangpur Shumali.", contactNo: "0345-923-9956" },
  { sNo: 251, name: "Mohammad Daniyal, 7905/FRP (Recruit)", rank: "FC", dateOfShahadat: "11.10.2025", unit: "FRP Police", residency: "Wanda Laali, Paniala.", contactNo: "0343-344-0600" },
  { sNo: 252, name: "Farhan Ullah, 8184/FRP (Recruit)", rank: "FC", dateOfShahadat: "11.10.2025", unit: "FRP Police", residency: "Village Shah Hassan Khel.", contactNo: "0342-512-4744" },
  { sNo: 253, name: "Shafqat Mehmood, 5846/FRP", rank: "HC", dateOfShahadat: "11.10.2025", unit: "FRP Police", residency: "Moh: Qureshi Malwan Village Tarakai Khel, District Karak", contactNo: "0335-195-3132" },
  { sNo: 254, name: "Mohammad Ramzan, 04/ESM", rank: "FC", dateOfShahadat: "20.11.2025", unit: "Other District", residency: "Village Khojaki Kala , Haji Banda, Karak", contactNo: "0343-923-6267" },
  { sNo: 255, name: "Saif ur Rehman, 3831/Elite", rank: "HC", dateOfShahadat: "20.11.2025", unit: "Elite Police", residency: "Village Katta Khel, Paniala.", contactNo: "0347-984-7851" },
  { sNo: 256, name: "Mohammad Rafiq, 142", rank: "FC", dateOfShahadat: "03.12.2025", unit: "District Police", residency: "Village Fateh Tehsil Paroa.", contactNo: "0334-763-4538" },
  { sNo: 257, name: "Gul Alam, 1165", rank: "ASI", dateOfShahadat: "03.12.2025", unit: "District Police", residency: "Village Haibati, Bahadari.", contactNo: "0312-381-6465" },
  { sNo: 258, name: "Sakhi Jan, 290/Driver", rank: "FC", dateOfShahadat: "03.12.2025", unit: "District Police", residency: "Village Bahadari, Giloti.", contactNo: "0346-007-0000" },
  { sNo: 259, name: "Mohammad Shoaib, 7850/FRP (Recruit)", rank: "FC", dateOfShahadat: "11.01.2026", unit: "FRP Police", residency: "Jhowk Umray Wali, Paharpur.", contactNo: "0344-982-0916" },
  { sNo: 260, name: "Ikram Ullah No. 72/SW, Lower", rank: "HC", dateOfShahadat: "06.02.2026", unit: "District Police", residency: "Village Maddi now Ejaz Abad, Muryali", contactNo: "0332-167-7051" },
  { sNo: 261, name: "Fahim Mumtaz Khan, D/52", rank: "SI", dateOfShahadat: "11.02.2026", unit: "District Police", residency: "Moh: Masti Khel, Paniala.", contactNo: "0343-184-9828" },
  { sNo: 262, name: "Mohammad Touqeer, 897", rank: "LHC", dateOfShahadat: "11.02.2026", unit: "District Police", residency: "Wandi Qazi Khokhar, Chashma Road.", contactNo: "0321-459-3399" },

  // Page 7 (263 to 269)
  { sNo: 263, name: "Ghulam Subhani, 1110", rank: "FC", dateOfShahadat: "11.02.2026", unit: "District Police", residency: "Chah Inayat Wala, Village Kachi Paharpur.", contactNo: "0345-983-1294" },
  { sNo: 264, name: "Irfan Ullah, 1405", rank: "FC", dateOfShahadat: "11.02.2026", unit: "District Police", residency: "Near Chunda Check Post.", contactNo: "0349-442-2275" },
  { sNo: 265, name: "Wajahat Hussain, 1015", rank: "FC", dateOfShahadat: "11.02.2026", unit: "Other District", residency: "Village Hazara, Paroa now Kotla Jam, District Bhakkar.", contactNo: "0347-127-8672" },
  { sNo: 266, name: "Mohammad Bilal, 1769", rank: "FC", dateOfShahadat: "18.02.2026", unit: "District Police", residency: "Village Toba, Band Kurai.", contactNo: "0308-847-7688" },
  { sNo: 267, name: "Abdul Aziz, 1777", rank: "FC", dateOfShahadat: "18.05.2026", unit: "District Police", residency: "Al-Razzaq Colony, Opp: Ratta Kulachi Stadium.", contactNo: "0342-937-0831" },
  { sNo: 268, name: "Faqir Ahmad, 42/D", rank: "ASI", dateOfShahadat: "31.07.2026", unit: "District Police", residency: "Jhowk Sikandar, Paroa", contactNo: "0345-987-5647" },
  { sNo: 269, name: "Wazir Ahmad, 261", rank: "HC", dateOfShahadat: "31.07.2026", unit: "District Police", residency: "Village Ramak, Paroa", contactNo: "0314-170-8599" },
];

function parseDate(str: string): Date {
  const parts = str.split(".");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(Date.UTC(year, month, day, 10, 0, 0));
  }
  return new Date();
}

async function main() {
  console.log(`Starting migration with ${SHUHADA_RECORDS.length} Shuhada records...`);

  // Ensure default hospital exists
  const defaultHospital = await prisma.hospital.findFirst({
    where: { code: "DHQ" }
  }) || await prisma.hospital.findFirst();

  const hospitalId = defaultHospital ? defaultHospital.id : null;

  // Step 1: Clean all application records except users and hospitals
  console.log("Cleaning old application data while preserving users and hospitals...");
  await prisma.actionTracker.deleteMany();
  await prisma.monthlyReport.deleteMany();
  await prisma.sehatClaim.deleteMany();
  await prisma.visit.deleteMany();
  await prisma.grievance.deleteMany();
  await prisma.cardUpdateHistory.deleteMany();
  await prisma.lostDamagedCard.deleteMany();
  await prisma.beneficiaryStatusChange.deleteMany();
  await prisma.misuseFlag.deleteMany();
  await prisma.healthCard.deleteMany();
  await prisma.familyMember.deleteMany();
  await prisma.document.deleteMany();
  await prisma.family.deleteMany();
  await prisma.auditLog.deleteMany();

  console.log("Old data cleaned. Now importing 269 Shuhada...");

  let imported = 0;

  for (const item of SHUHADA_RECORDS) {
    const regNo = `SH-DIK-${String(item.sNo).padStart(3, "0")}`;
    const cardNo = `HC-DIK-${String(item.sNo).padStart(3, "0")}`;
    const qrId = `QR-DIK-${String(item.sNo).padStart(3, "0")}`;
    const dateShahadat = parseDate(item.dateOfShahadat);

    // Extract district if mentioned in residency or unit
    let district = "Dera Ismail Khan";
    const lowerRes = item.residency.toLowerCase();
    if (lowerRes.includes("lakki marwat")) district = "Lakki Marwat";
    else if (lowerRes.includes("bhakkar")) district = "Bhakkar";
    else if (lowerRes.includes("bannu")) district = "Bannu";
    else if (lowerRes.includes("tank")) district = "Tank";
    else if (lowerRes.includes("charsada") || lowerRes.includes("charsadda")) district = "Charsadda";
    else if (lowerRes.includes("mardan")) district = "Mardan";
    else if (lowerRes.includes("lower dir")) district = "Lower Dir";
    else if (lowerRes.includes("karak")) district = "Karak";
    else if (lowerRes.includes("swabi")) district = "Swabi";
    else if (lowerRes.includes("buner")) district = "Buner";
    else if (lowerRes.includes("kurram")) district = "Kurram";
    else if (lowerRes.includes("dera ghazi khan")) district = "Dera Ghazi Khan";
    else if (lowerRes.includes("peshawar")) district = "Peshawar";
    else if (lowerRes.includes("waziristan")) district = "South Waziristan";

    // Extract badge / service number if present in name
    let serviceNo: string | null = null;
    const match = item.name.match(/(?:No\.?\s*|\b)(\d+[\w\/-]*)/i);
    if (match) {
      serviceNo = match[1];
    }

    const family = await prisma.family.create({
      data: {
        registrationNo: regNo,
        dateOfRegistration: dateShahadat,
        healthCardNo: cardNo,
        qrDigitalId: qrId,
        shaheedName: item.name,
        shaheedRank: item.rank,
        shaheedDepartment: "Police Department",
        shaheedUnit: item.unit,
        shaheedServiceNo: serviceNo,
        shaheedDateOfShahadat: dateShahadat,
        shaheedPermanentDistrict: district,
        shaheedPermanentAddress: item.residency,
        contactName: `Family of Shaheed ${item.name}`,
        contactRelationship: "Dependent Family",
        contactCnic: `12101-${String(item.sNo).padStart(7, "0")}-1`,
        contactMobile: item.contactNo,
        contactPresentAddress: item.residency,
        contactDistrict: district,
        documentsSubmitted: [
          "Official Shahadat Certificate / Police Record",
          "Police Department Shuhada List Entry"
        ],
        verificationStatus: "VERIFIED_ELIGIBLE",
        verificationAuthority: "District Police Officer, Dera Ismail Khan",
        verificationRemarks: `Verified Shuhada Record S# ${item.sNo}. List updated up to 04.08.2026.`,
        verifiedBy: "Focal Person Shuhada Desk",
        verifiedByDesignation: "Incharge Shuhada Desk, D.I. Khan",
        verifiedSignatureDate: "2026-08-04",
        cardRegistrationId: `REG-${String(item.sNo).padStart(3, "0")}`,
        cardQrVerificationId: qrId,
        cardDateOfIssue: dateShahadat,
        cardPhysicalIssued: true,
        cardDigitalRecordCreated: true,
        cardBeneficiariesLinked: true,
        cardSystemUpdated: true,
        hospitalAccessDHQ: true,
        hospitalAccessMMMTH: true,
        hospitalAccessWC: true,
        hospitalId: hospitalId,
        authorizationDecision: "APPROVED_FOR_HEALTH_CARD",
        authorizedOfficer: "Hospital Director / Medical Superintendent",
        authorizedDesignation: "Designated Healthcare Authority",
        members: {
          create: [
            {
              serialNo: 1,
              name: `Primary Nominee / Dependent of ${item.name}`,
              relationship: "Dependent / Next of Kin",
              cnicBForm: `12101-${String(item.sNo).padStart(7, "0")}-1`,
              mobile: item.contactNo,
              status: "Active",
              beneficiaryId: `BEN-DIK-${String(item.sNo).padStart(3, "0")}-01`,
              cardStatus: "ACTIVE",
            }
          ]
        },
      }
    });

    // Also create matching active HealthCard record
    await prisma.healthCard.create({
      data: {
        familyRegistrationNo: regNo,
        cardNo: cardNo,
        qrDigitalVerificationId: qrId,
        dateOfRegistration: dateShahadat,
        dateOfCardIssue: dateShahadat,
        status: "ACTIVE",
        specialFlags: ["Police Shuhada Family", "Priority Healthcare Access"],
        controlFlags: ["Valid Health Card", "Verified via District Police Shuhada Cell"],
        issuedBy: "Health Desk Focal Person",
        issuedByDesignation: "Focal Person DSFHI",
        accessDHQ: true,
        accessMMMTH: true,
        accessWC: true,
        reviewFlags: ["Verified"],
        authorisedOfficer: "Medical Superintendent",
        authorisedDesignation: "Hospital Director",
      }
    });

    imported++;
  }

  const finalCount = await prisma.family.count();
  const cardCount = await prisma.healthCard.count();
  const userCount = await prisma.user.count();

  console.log("\n=== IMPORT COMPLETED SUCCESSFULLY ===");
  console.log(`Imported records: ${imported}`);
  console.log(`Total Families in DB: ${finalCount}`);
  console.log(`Total Health Cards in DB: ${cardCount}`);
  console.log(`Total Users preserved: ${userCount}`);
}

main()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
