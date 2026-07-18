export type CountryImageSet = {
  heroBackground: string;
  heroFeature: string;
  overview: string;
  admission: string;
};

export type UniversityImageSet = {
  heroBackground: string;
  heroFeature: string;
  overview: string;
};

import germanyImg from "@/assets/dest-germany.jpg";
import dubaiImg from "@/assets/dest-dubai.jpg";
import dubaiBurjImg from "@/assets/dest-dubai-burj.optimized.webp";
import ukImg from "@/assets/dest-uk.jpg";

export const countryImageSelections: Record<string, CountryImageSet> = {
  "italy": {
    "heroBackground": "/images/library/countries/italy/set-04/000017.jpg",
    "heroFeature": "/images/library/countries/italy/set-03/000002.jpg",
    "overview": "/images/library/countries/italy/set-04/000006.jpg",
    "admission": "/images/library/countries/italy/set-04/000001.jpg"
  },
  "germany": {
    "heroBackground": "/images/library/countries/germany/set-01/000015.jpg",
    "heroFeature": "/images/library/countries/germany/set-04/000002.jpg",
    "overview": "/images/library/countries/germany/set-01/000010.jpg",
    "admission": "/images/library/countries/germany/set-04/000005.jpg"
  },
  "france": {
    "heroBackground": "/images/library/countries/france/set-04/000017.jpg",
    "heroFeature": "/images/library/countries/france/set-04/000014.jpg",
    "overview": "/images/library/countries/france/set-04/000010.jpg",
    "admission": "/images/library/countries/france/set-01/000018.jpg"
  },
  "uk": {
    "heroBackground": "/images/library/countries/uk/set-02/000018.jpg",
    "heroFeature": "/images/library/countries/uk/set-03/000014.jpg",
    "overview": "/images/library/countries/uk/set-03/000015.jpg",
    "admission": "/images/library/countries/uk/set-01/000007.jpg"
  },
  "canada": {
    "heroBackground": "/images/library/countries/canada/set-01/000006.jpg",
    "heroFeature": "/images/library/countries/canada/set-02/000019.jpg",
    "overview": "/images/library/countries/canada/set-02/000018.jpg",
    "admission": "/images/library/countries/canada/set-04/000002.jpg"
  },
  "usa": {
    "heroBackground": "/images/library/countries/usa/set-01/000012.jpg",
    "heroFeature": "/images/library/countries/usa/set-02/000017.jpg",
    "overview": "/images/library/countries/usa/set-01/000003.jpg",
    "admission": "/images/library/countries/usa/set-02/000018.jpg"
  },
  "australia": {
    "heroBackground": "/images/library/countries/australia/web-02.jpg",
    "heroFeature": "/images/library/countries/australia/web-04.jpg",
    "overview": "/images/library/countries/australia/web-06.jpg",
    "admission": "/images/library/countries/australia/web-05.jpg"
  }
};

export const universityImageSelections: Record<string, UniversityImageSet> = {
  "italy/sapienza-university-of-rome": {
    "heroBackground": "/images/library/universities/italy/sapienza-university-of-rome/000001.jpg",
    "heroFeature": "/images/library/universities/italy/sapienza-university-of-rome/000005.jpg",
    "overview": "/images/library/universities/italy/sapienza-university-of-rome/000008.jpg"
  },
  "italy/university-of-bologna": {
    "heroBackground": "/images/library/universities/italy/university-of-bologna/000008.jpg",
    "heroFeature": "/images/library/universities/italy/university-of-bologna/000009.jpg",
    "overview": "/images/library/universities/italy/university-of-bologna/000011.jpg"
  },
  "italy/politecnico-di-milano": {
    "heroBackground": "/images/library/universities/italy/politecnico-di-milano/000001.jpg",
    "heroFeature": "/images/library/universities/italy/politecnico-di-milano/000012.jpg",
    "overview": "/images/library/universities/italy/politecnico-di-milano/000002.jpg"
  },
  "italy/university-of-milan": {
    "heroBackground": "/images/library/universities/italy/university-of-milan/000006.jpg",
    "heroFeature": "/images/library/universities/italy/university-of-milan/000012.jpg",
    "overview": "/images/library/universities/italy/university-of-milan/000008.jpg"
  },
  "italy/university-of-padua": {
    "heroBackground": "/images/library/universities/italy/university-of-padua/000003.jpg",
    "heroFeature": "/images/library/universities/italy/university-of-padua/000012.jpg",
    "overview": "/images/library/universities/italy/university-of-padua/000006.jpg"
  },
  "italy/politecnico-di-torino": {
    "heroBackground": "/images/library/universities/italy/politecnico-di-torino/000006.jpg",
    "heroFeature": "/images/library/universities/italy/politecnico-di-torino/000005.jpg",
    "overview": "/images/library/universities/italy/politecnico-di-torino/000002.jpg"
  },
  "italy/university-of-pisa": {
    "heroBackground": "/images/library/universities/italy/university-of-pisa/000011.jpg",
    "heroFeature": "/images/library/universities/italy/university-of-pisa/000004.jpg",
    "overview": "/images/library/universities/italy/university-of-pisa/000005.jpg"
  },
  "italy/university-of-naples-federico-ii": {
    "heroBackground": "/images/library/universities/italy/university-of-naples-federico-ii/000001.jpg",
    "heroFeature": "/images/library/universities/italy/university-of-naples-federico-ii/000008.jpg",
    "overview": "/images/library/universities/italy/university-of-naples-federico-ii/000010.jpg"
  },
  "italy/university-of-florence": {
    "heroBackground": "/images/library/universities/italy/university-of-florence/000006.jpg",
    "heroFeature": "/images/library/universities/italy/university-of-florence/000004.jpg",
    "overview": "/images/library/universities/italy/university-of-florence/000008.jpg"
  },
  "italy/university-of-turin": {
    "heroBackground": "/images/library/universities/italy/university-of-turin/000008.jpg",
    "heroFeature": "/images/library/universities/italy/university-of-turin/000005.jpg",
    "overview": "/images/library/universities/italy/university-of-turin/000003.jpg"
  },
  "italy/university-of-siena": {
    "heroBackground": "/images/library/universities/italy/university-of-siena/000010.jpg",
    "heroFeature": "/images/library/universities/italy/university-of-siena/000004.jpg",
    "overview": "/images/library/universities/italy/university-of-siena/000008.jpg"
  },
  "italy/university-of-trento": {
    "heroBackground": "/images/library/universities/italy/university-of-trento/000003.jpg",
    "heroFeature": "/images/library/universities/italy/university-of-trento/000006.jpg",
    "overview": "/images/library/universities/italy/university-of-trento/000005.jpg"
  },
  "italy/university-of-genoa": {
    "heroBackground": "/images/library/universities/italy/university-of-genoa/000002.jpg",
    "heroFeature": "/images/library/universities/italy/university-of-genoa/000004.jpg",
    "overview": "/images/library/universities/italy/university-of-genoa/000011.jpg"
  },
  "italy/university-of-palermo": {
    "heroBackground": "/images/library/universities/italy/university-of-palermo/000012.jpg",
    "heroFeature": "/images/library/universities/italy/university-of-palermo/000007.jpg",
    "overview": "/images/library/universities/italy/university-of-palermo/000004.jpg"
  },
  "italy/university-of-messina": {
    "heroBackground": "/images/library/universities/italy/university-of-messina/000006.jpg",
    "heroFeature": "/images/library/universities/italy/university-of-messina/000005.jpg",
    "overview": "/images/library/universities/italy/university-of-messina/000010.jpg"
  },
  "italy/university-of-parma": {
    "heroBackground": "/images/library/universities/italy/university-of-parma/000004.jpg",
    "heroFeature": "/images/library/universities/italy/university-of-parma/000012.jpg",
    "overview": "/images/library/universities/italy/university-of-parma/000007.jpg"
  },
  "italy/university-of-cassino-and-southern-lazio": {
    "heroBackground": "/images/library/universities/italy/university-of-cassino-and-southern-lazio/000005.jpg",
    "heroFeature": "/images/library/universities/italy/university-of-cassino-and-southern-lazio/000006.jpg",
    "overview": "/images/library/universities/italy/university-of-cassino-and-southern-lazio/000003.jpg"
  },
  "italy/university-of-macerata": {
    "heroBackground": "/images/library/universities/italy/university-of-macerata/000010.jpg",
    "heroFeature": "/images/library/universities/italy/university-of-macerata/000006.jpg",
    "overview": "/images/library/universities/italy/university-of-macerata/000007.jpg"
  },
  "italy/university-of-camerino": {
    "heroBackground": "/images/library/universities/italy/university-of-camerino/000006.jpg",
    "heroFeature": "/images/library/universities/italy/university-of-camerino/000009.jpg",
    "overview": "/images/library/universities/italy/university-of-camerino/000002.jpg"
  },
  "italy/university-of-trieste": {
    "heroBackground": "/images/library/universities/italy/university-of-trieste/000002.jpg",
    "heroFeature": "/images/library/universities/italy/university-of-trieste/000003.jpg",
    "overview": "/images/library/universities/italy/university-of-trieste/000008.jpg"
  },
  "italy/university-of-calabria": {
    "heroBackground": "/images/library/universities/italy/university-of-calabria/000002.jpg",
    "heroFeature": "/images/library/universities/italy/university-of-calabria/000006.jpg",
    "overview": "/images/library/universities/italy/university-of-calabria/000001.jpg"
  },
  "italy/university-of-catania": {
    "heroBackground": "/images/library/universities/italy/university-of-catania/000011.jpg",
    "heroFeature": "/images/library/universities/italy/university-of-catania/000005.jpg",
    "overview": "/images/library/universities/italy/university-of-catania/000002.jpg"
  },
  "italy/university-of-sassari": {
    "heroBackground": "/images/library/universities/italy/university-of-sassari/000004.jpg",
    "heroFeature": "/images/library/universities/italy/university-of-sassari/000010.jpg",
    "overview": "/images/library/universities/italy/university-of-sassari/000006.jpg"
  },
  "italy/university-of-tuscia": {
    "heroBackground": "/images/library/universities/italy/university-of-tuscia/000003.jpg",
    "heroFeature": "/images/library/universities/italy/university-of-tuscia/000009.jpg",
    "overview": "/images/library/universities/italy/university-of-tuscia/000012.jpg"
  },
  "germany/technical-university-of-munich": {
    "heroBackground": "/images/library/universities/germany/technical-university-of-munich/000002.jpg",
    "heroFeature": "/images/library/universities/germany/technical-university-of-munich/000010.jpg",
    "overview": "/images/library/universities/germany/technical-university-of-munich/000011.jpg"
  },
  "germany/rwth-aachen": {
    "heroBackground": "/images/library/universities/germany/rwth-aachen/000011.jpg",
    "heroFeature": "/images/library/universities/germany/rwth-aachen/000012.jpg",
    "overview": "/images/library/universities/germany/rwth-aachen/000010.jpg"
  },
  "germany/lmu-munich": {
    "heroBackground": "/images/library/universities/germany/lmu-munich/000005.jpg",
    "heroFeature": "/images/library/universities/germany/lmu-munich/000006.jpg",
    "overview": "/images/library/universities/germany/lmu-munich/000003.jpg"
  },
  "germany/university-of-heidelberg": {
    "heroBackground": "/images/library/universities/germany/university-of-heidelberg/000009.jpg",
    "heroFeature": "/images/library/universities/germany/university-of-heidelberg/000005.jpg",
    "overview": "/images/library/universities/germany/university-of-heidelberg/000010.jpg"
  },
  "germany/constructor-university-bremen": {
    "heroBackground": germanyImg,
    "heroFeature": "/images/library/countries/germany/set-04/000002.jpg",
    "overview": "/images/library/countries/germany/set-02/000010.jpg"
  },
  "germany/steinbeis-university-berlin": {
    "heroBackground": "/images/library/countries/germany/set-03/000003.jpg",
    "heroFeature": "/images/library/countries/germany/set-01/000015.jpg",
    "overview": "/images/library/countries/germany/set-04/000005.jpg"
  },
  "germany/srh-university": {
    "heroBackground": "/images/library/countries/germany/set-01/000015.jpg",
    "heroFeature": "/images/library/countries/germany/set-03/000014.jpg",
    "overview": "/images/library/countries/germany/set-04/000005.jpg"
  },
  "germany/hamburg-university-of-technology-tuhh": {
    "heroBackground": "/images/library/countries/germany/set-04/000011.jpg",
    "heroFeature": "/images/library/countries/germany/set-01/000010.jpg",
    "overview": "/images/library/countries/germany/set-02/000018.jpg"
  },
  "germany/fom-hochschule": {
    "heroBackground": "/images/library/countries/germany/set-03/000002.jpg",
    "heroFeature": "/images/library/countries/germany/set-02/000012.jpg",
    "overview": "/images/library/countries/germany/set-04/000006.jpg"
  },
  "germany/iu-international-university-of-applied-sciences": {
    "heroBackground": "/images/library/countries/germany/set-01/000017.jpg",
    "heroFeature": "/images/library/countries/germany/set-03/000009.jpg",
    "overview": "/images/library/countries/germany/set-02/000013.jpg"
  },
  "germany/arden-university-berlin": {
    "heroBackground": "/images/library/countries/germany/set-04/000012.jpg",
    "heroFeature": "/images/library/countries/germany/set-03/000006.jpg",
    "overview": "/images/library/countries/germany/set-01/000011.jpg"
  },
  "germany/gisma-university-of-applied-sciences": {
    "heroBackground": "/images/library/countries/germany/set-02/000007.jpg",
    "heroFeature": "/images/library/countries/germany/set-01/000014.jpg",
    "overview": "/images/library/countries/germany/set-03/000010.jpg"
  },
  "france/sciences-po": {
    "heroBackground": "/images/library/universities/france/sciences-po/000009.jpg",
    "heroFeature": "/images/library/universities/france/sciences-po/000006.jpg",
    "overview": "/images/library/universities/france/sciences-po/000008.jpg"
  },
  "france/hec-paris": {
    "heroBackground": "/images/library/universities/france/hec-paris/000008.jpg",
    "heroFeature": "/images/library/universities/france/hec-paris/000006.jpg",
    "overview": "/images/library/universities/france/hec-paris/000005.jpg"
  },
  "france/essec-business-school": {
    "heroBackground": "/images/library/universities/france/essec-business-school/000003.jpg",
    "heroFeature": "/images/library/universities/france/essec-business-school/000005.jpg",
    "overview": "/images/library/universities/france/essec-business-school/000006.jpg"
  },
  "france/kedge-business-school": {
    "heroBackground": "/images/library/universities/france/kedge-business-school/000003.jpg",
    "heroFeature": "/images/library/universities/france/kedge-business-school/000002.jpg",
    "overview": "/images/library/universities/france/kedge-business-school/000010.jpg"
  },
  "uk/imperial-college-london": {
    "heroBackground": "/images/library/universities/uk/imperial-college-london/000007.jpg",
    "heroFeature": "/images/library/universities/uk/imperial-college-london/000005.jpg",
    "overview": "/images/library/universities/uk/imperial-college-london/000004.jpg"
  },
  "uk/king-s-college-london": {
    "heroBackground": "/images/library/universities/uk/king-s-college-london/000007.jpg",
    "heroFeature": "/images/library/universities/uk/king-s-college-london/000002.jpg",
    "overview": "/images/library/universities/uk/king-s-college-london/000011.jpg"
  },
  "uk/university-of-manchester": {
    "heroBackground": "/images/library/universities/uk/university-of-manchester/000011.jpg",
    "heroFeature": "/images/library/universities/uk/university-of-manchester/000009.jpg",
    "overview": "/images/library/universities/uk/university-of-manchester/000005.jpg"
  },
  "uk/university-of-birmingham": {
    "heroBackground": "/images/library/universities/uk/university-of-birmingham/000008.jpg",
    "heroFeature": "/images/library/universities/uk/university-of-birmingham/000010.jpg",
    "overview": "/images/library/universities/uk/university-of-birmingham/000009.jpg"
  },
  "uk/university-of-hertfordshire": {
    "heroBackground": ukImg,
    "heroFeature": ukImg,
    "overview": ukImg
  },
  "canada/university-of-toronto": {
    "heroBackground": "/images/library/universities/canada/university-of-toronto/000006.jpg",
    "heroFeature": "/images/library/universities/canada/university-of-toronto/000007.jpg",
    "overview": "/images/library/universities/canada/university-of-toronto/000010.jpg"
  },
  "canada/university-of-british-columbia": {
    "heroBackground": "/images/library/universities/canada/university-of-british-columbia/000002.jpg",
    "heroFeature": "/images/library/universities/canada/university-of-british-columbia/000001.jpg",
    "overview": "/images/library/universities/canada/university-of-british-columbia/000007.jpg"
  },
  "canada/mcgill-university": {
    "heroBackground": "/images/library/universities/canada/mcgill-university/000006.jpg",
    "heroFeature": "/images/library/universities/canada/mcgill-university/000009.jpg",
    "overview": "/images/library/universities/canada/mcgill-university/000001.jpg"
  },
  "canada/university-of-waterloo": {
    "heroBackground": "/images/library/universities/canada/university-of-waterloo/000007.jpg",
    "heroFeature": "/images/library/universities/canada/university-of-waterloo/000002.jpg",
    "overview": "/images/library/universities/canada/university-of-waterloo/000006.jpg"
  },
  "usa/northeastern-university": {
    "heroBackground": "/images/library/universities/usa/northeastern-university/web-02.jpg",
    "heroFeature": "/images/library/universities/usa/northeastern-university/web-03.jpg",
    "overview": "/images/library/universities/usa/northeastern-university/web-04.jpg"
  },
  "usa/drexel-university": {
    "heroBackground": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Campus_view_-_Drexel_University_-_IMG_7303.JPG/1920px-Campus_view_-_Drexel_University_-_IMG_7303.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "heroFeature": "/images/library/countries/usa/set-01/000014.jpg",
    "overview": "/images/library/countries/usa/set-02/000015.jpg"
  },
  "usa/university-of-southern-california": {
    "heroBackground": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Doheny.jpg/1920px-Doheny.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "heroFeature": "/images/library/countries/usa/set-01/000004.jpg",
    "overview": "/images/library/countries/usa/set-02/000012.jpg"
  },
  "usa/arizona-state-university": {
    "heroBackground": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Palm_Walk_-_Arizona_State_University_-_Tempe%2C_AZ_-_DSC05915.JPG/1920px-Palm_Walk_-_Arizona_State_University_-_Tempe%2C_AZ_-_DSC05915.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "heroFeature": "/images/library/countries/usa/set-02/000011.jpg",
    "overview": "/images/library/countries/usa/set-01/000008.jpg"
  },
  "australia/university-of-melbourne": {
    "heroBackground": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Botany_Building._Parkville_Campus.JPG/1920px-Botany_Building._Parkville_Campus.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "heroFeature": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Old_Arts_Building._Parkville_Campus_of_University_of_Melbourne.JPG/1920px-Old_Arts_Building._Parkville_Campus_of_University_of_Melbourne.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "overview": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/University_Of_Melbourne_Student_Union_House.JPG/1920px-University_Of_Melbourne_Student_Union_House.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail"
  },
  "australia/unsw-sydney": {
    "heroBackground": "https://upload.wikimedia.org/wikipedia/commons/5/5f/UNSW_Main_Walk.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    "heroFeature": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/%281%29UNSW_Quadrangle_003.jpg/1920px-%281%29UNSW_Quadrangle_003.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "overview": "https://upload.wikimedia.org/wikipedia/commons/a/a1/Globe_UNSW_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled"
  },
  "australia/monash-university": {
    "heroBackground": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Monash_University_Clayton_Campus.jpg/1920px-Monash_University_Clayton_Campus.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "heroFeature": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Clayton_-_Monash_University.jpg/1920px-Clayton_-_Monash_University.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "overview": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Statue_of_John_Monash%2C_Monash_University_%28Clayton_Campus%29%2C_Melbourne_2017-10-30_01.jpg/1920px-Statue_of_John_Monash%2C_Monash_University_%28Clayton_Campus%29%2C_Melbourne_2017-10-30_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail"
  },
  "australia/university-of-sydney": {
    "heroBackground": "https://upload.wikimedia.org/wikipedia/commons/2/23/University_of_Sydney_Main_Quadrangle.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    "heroFeature": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/SydneyUniversity_MainQuadrangle_panorama_270.jpg/1920px-SydneyUniversity_MainQuadrangle_panorama_270.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "overview": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Sydney_University_Main_Quadrangle_Cloisters.jpg/1920px-Sydney_University_Main_Quadrangle_Cloisters.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail"
  },
  "dubai/middlesex-university-dubai": {
    "heroBackground": dubaiBurjImg,
    "heroFeature": dubaiImg,
    "overview": dubaiBurjImg
  },
  "dubai/manipal-academy-of-higher-education-dubai": {
    "heroBackground": dubaiImg,
    "heroFeature": dubaiBurjImg,
    "overview": dubaiImg
  },
  "dubai/de-montfort-university-dubai": {
    "heroBackground": dubaiBurjImg,
    "heroFeature": dubaiImg,
    "overview": dubaiBurjImg
  }
};
