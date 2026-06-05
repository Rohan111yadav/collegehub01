import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const collegesData = [
  {
    name: "Indian Institute of Technology Delhi (IIT Delhi)",
    location: "New Delhi, Delhi",
    fees: 220000,
    rating: 4.9,
    placements: 21.5,
    image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop",
    description: "Indian Institute of Technology Delhi is one of the premier public research universities located in Hauz Khas, Delhi. Established in 1961, it is consistently ranked among the top engineering colleges in India. The institution is known for its rigorous academic curriculum, state-of-the-art research laboratories, and strong global alumni network, producing leaders in technology, business, and public service.",
    courses: [
      "B.Tech Computer Science & Engineering",
      "B.Tech Electrical Engineering",
      "B.Tech Mechanical Engineering",
      "B.Tech Biotechnology",
      "M.Tech Data Science & AI"
    ],
    reviews: [
      { author: "Aman Sharma", rating: 5, comment: "Rigorous academic environment, but the learning curve and peer group are unparalleled. Placements are stellar." },
      { author: "Sneha Patel", rating: 4.8, comment: "Fabulous campus culture and research facilities. Hauz Khas location makes city life very accessible." }
    ],
    establishedYear: 1961,
    type: "Public",
    accreditation: "NAAC A++",
    website: "https://home.iitd.ac.in"
  },
  {
    name: "Indian Institute of Technology Bombay (IIT Bombay)",
    location: "Mumbai, Maharashtra",
    fees: 230000,
    rating: 4.9,
    placements: 22.8,
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
    description: "Situated in Powai, Mumbai, IIT Bombay is a global powerhouse of technical education and research. Established in 1958, the campus offers a beautiful green sanctuary inside the bustling city of Mumbai. Famous for its cultural festival Mood Indigo and technology fest Techfest, IIT Bombay fosters holistic student development and hosts leading startup incubators.",
    courses: [
      "B.Tech Computer Science",
      "B.Tech Aerospace Engineering",
      "B.Tech Engineering Physics",
      "B.Tech Chemical Engineering",
      "M.Tech Microelectronics"
    ],
    reviews: [
      { author: "Rohan Kulkarni", rating: 5, comment: "Mood Indigo and Powai lake are memories of a lifetime. The technical exposure you get here is second to none." },
      { author: "Deepika Rao", rating: 4.8, comment: "Stunning placements, world-class professors. The startup culture on campus is very motivating." }
    ],
    establishedYear: 1958,
    type: "Public",
    accreditation: "NAAC A++",
    website: "https://www.iitb.ac.in"
  },
  {
    name: "Indian Institute of Technology Madras (IIT Madras)",
    location: "Chennai, Tamil Nadu",
    fees: 215000,
    rating: 4.8,
    placements: 20.2,
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop",
    description: "Indian Institute of Technology Madras is a public technical university located in Chennai. Consistently ranked #1 in the NIRF rankings, IIT Madras is acclaimed for its research park, which has incubated over 200 startups. The campus is a lush forest reserve populated by deer and blackbucks, providing a peaceful environment for study and research.",
    courses: [
      "B.Tech Computer Science & Engineering",
      "B.Tech Naval Architecture & Ocean Engineering",
      "B.Tech Electrical Engineering",
      "B.Tech Engineering Design",
      "M.S. Robotics"
    ],
    reviews: [
      { author: "Sriram Nathan", rating: 4.9, comment: "NIRF Rank 1 is completely justified. The research park offers incredible opportunities for innovation." },
      { author: "Meera Nair", rating: 4.7, comment: "Living amidst nature with deer running around is serene. Placements are solid across all departments." }
    ],
    establishedYear: 1959,
    type: "Public",
    accreditation: "NAAC A++",
    website: "https://www.iitm.ac.in"
  },
  {
    name: "Indian Institute of Technology Kharagpur (IIT Kharagpur)",
    location: "Kharagpur, West Bengal",
    fees: 225000,
    rating: 4.7,
    placements: 18.9,
    image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=600&auto=format&fit=crop",
    description: "The oldest IIT, established in 1951, IIT Kharagpur has the largest campus among all IITs, spanning 2100 acres. Famous for its Spring Fest and Kshitij festivals, IIT Kharagpur offers the widest selection of engineering disciplines and has a massive alumni base including Sundar Pichai.",
    courses: [
      "B.Tech Computer Science & Engineering",
      "B.Tech Agricultural & Food Engineering",
      "B.Tech Mining Engineering",
      "Integrated M.Sc Physics",
      "M.Tech Biotechnology"
    ],
    reviews: [
      { author: "Sourav Ghosh", rating: 4.8, comment: "KGP ka tempo high! The campus is huge and walking/cycling around is a great experience. Amazing placement records." },
      { author: "Priti Sen", rating: 4.6, comment: "Large campus with tons of extracurricular activities. The alumni network is the biggest asset here." }
    ],
    establishedYear: 1951,
    type: "Public",
    accreditation: "NAAC A++",
    website: "https://www.iitkgp.ac.in"
  },
  {
    name: "Birla Institute of Technology and Science (BITS Pilani)",
    location: "Pilani, Rajasthan",
    fees: 450000,
    rating: 4.7,
    placements: 15.6,
    image: "https://images.unsplash.com/photo-1527891751199-7225231a68dd?q=80&w=600&auto=format&fit=crop",
    description: "Birla Institute of Technology & Science, Pilani is India's leading private engineering university. Known for its zero attendance policy, BITS Pilani grants students absolute flexibility in scheduling and academics. BITS is also renowned for its Practice School (internship) program, providing students with direct corporate exposure.",
    courses: [
      "B.E. Computer Science",
      "B.E. Electronics & Communication",
      "B.E. Chemical Engineering",
      "M.Sc Economics (Dual Degree)",
      "M.E. Software Systems"
    ],
    reviews: [
      { author: "Karthik Mehta", rating: 4.7, comment: "No attendance policy gives you the freedom to build your own startups or projects. Great placements too." },
      { author: "Aditi Jain", rating: 4.7, comment: "The BITSian network is extremely powerful. The Practice School internship program gave me my PPO." }
    ],
    establishedYear: 1964,
    type: "Private",
    accreditation: "NAAC A++",
    website: "https://www.bits-pilani.ac.in"
  },
  {
    name: "Delhi Technological University (DTU)",
    location: "New Delhi, Delhi",
    fees: 190000,
    rating: 4.5,
    placements: 14.8,
    image: "https://images.unsplash.com/photo-1607237138185-eedd996e5b09?q=80&w=600&auto=format&fit=crop",
    description: "Formerly known as Delhi College of Engineering (DCE), Delhi Technological University is one of the oldest engineering colleges in India, established in 1941. Spanning over 164 acres in Rohini, DTU is famous for its vibrant tech-societies, automotive teams, and excellent placement packages.",
    courses: [
      "B.Tech Computer Engineering",
      "B.Tech Software Engineering",
      "B.Tech Information Technology",
      "B.Tech Electronics & Communication",
      "M.Tech Artificial Intelligence"
    ],
    reviews: [
      { author: "Vikas Choudhary", rating: 4.6, comment: "DCE legacy is strong. Placements are neck-to-neck with IITs, especially for tech roles. Super active societies." },
      { author: "Riya Gupta", rating: 4.4, comment: "The coding culture is amazing. The campus has good infrastructure and very supportive seniors." }
    ],
    establishedYear: 1941,
    type: "Public",
    accreditation: "NAAC A",
    website: "https://www.dtu.ac.in"
  },
  {
    name: "National Institute of Technology Trichy (NIT Trichy)",
    location: "Tiruchirappalli, Tamil Nadu",
    fees: 145000,
    rating: 4.6,
    placements: 13.5,
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop",
    description: "Consistently ranked as the top NIT in India, NIT Trichy (NITT) is a public engineering institution located near Tiruchirappalli. The campus spans over 800 acres, offering a vibrant environment with diverse clubs, state of the art computational facilities, and a very strong record in core and software placements.",
    courses: [
      "B.Tech Computer Science & Engineering",
      "B.Tech Electronics & Communication",
      "B.Tech Production Engineering",
      "B.Tech Metallurgical Engineering",
      "M.C.A. (Master of Computer Applications)"
    ],
    reviews: [
      { author: "Vijay Kumar", rating: 4.7, comment: "NITT is a brand of its own. Festember and Pragyan are massive fests. Outstanding placements every year." },
      { author: "Akila R.", rating: 4.5, comment: "Very competitive environment but highly rewarding. Hostels are decent, and the campus has everything you need." }
    ],
    establishedYear: 1964,
    type: "Public",
    accreditation: "NAAC A+",
    website: "https://www.nitt.edu"
  },
  {
    name: "Vellore Institute of Technology (VIT)",
    location: "Vellore, Tamil Nadu",
    fees: 198000,
    rating: 4.3,
    placements: 8.5,
    image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=600&auto=format&fit=crop",
    description: "Vellore Institute of Technology is a leading private university in Vellore, Tamil Nadu. Known for its Flexible Credit System (FFCS), which allows students to choose their own timings and faculty, VIT has a massive student body and holds Limca records for placements.",
    courses: [
      "B.Tech Computer Science & Engineering",
      "B.Tech Information Technology",
      "B.Tech Electronics & Computer Engineering",
      "B.Tech Biotechnology",
      "M.C.A. Computer Science"
    ],
    reviews: [
      { author: "Suresh Pillai", rating: 4.4, comment: "FFCS is a great system. Placements are massive - almost everyone gets placed, although competition is fierce." },
      { author: "Neha Saxena", rating: 4.2, comment: "A bit strict rules regarding curfew, but the infrastructure, lab facilities, and campus are top class." }
    ],
    establishedYear: 1984,
    type: "Private",
    accreditation: "NAAC A++",
    website: "https://vit.ac.in"
  },
  {
    name: "College of Engineering Pune (COEP)",
    location: "Pune, Maharashtra",
    fees: 125000,
    rating: 4.4,
    placements: 9.8,
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop",
    description: "Established in 1854, COEP is the third oldest engineering college in Asia. Located in Pune (the 'Oxford of the East'), COEP is highly competitive, admitting students primarily through MHT-CET. COEP is famous for its student satellite project (Swayam) and rich legacy.",
    courses: [
      "B.Tech Computer Engineering",
      "B.Tech Electronics & Telecommunication",
      "B.Tech Metallurgy",
      "B.Tech Mechanical Engineering",
      "M.Tech Structural Engineering"
    ],
    reviews: [
      { author: "Pranav Deshmukh", rating: 4.5, comment: "Rich heritage and strong ties with Maharashtra industries. The Pune location helps a lot with internships." },
      { author: "Tanuja Joshi", rating: 4.3, comment: "Great campus and very active club culture (MindSpark and Zest). Placements for computer branch are amazing." }
    ],
    establishedYear: 1854,
    type: "Public",
    accreditation: "NAAC A+",
    website: "https://www.coep.org.in"
  },
  {
    name: "Jadavpur University",
    location: "Kolkata, West Bengal",
    fees: 10000,
    rating: 4.6,
    placements: 12.1,
    image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop",
    description: "Jadavpur University is a premier public state university in Kolkata, West Bengal. Renowned for its exceptionally low fee structure (around Rs. 10,000 for the entire B.Tech course) and high ROI, Jadavpur offers top-quality engineering education that is highly respected worldwide.",
    courses: [
      "B.E. Computer Science & Engineering",
      "B.E. Information Technology",
      "B.E. Electronics & Telecommunication",
      "B.E. Power Engineering",
      "M.E. Control Systems"
    ],
    reviews: [
      { author: "Rahul Bhattacharya", rating: 4.8, comment: "Unbelievable ROI. Spent virtually nothing on fees and bagged a package of 22 LPA. Very liberal campus." },
      { author: "Ananya Das", rating: 4.4, comment: "Academically excellent with a strong legacy. Placement cell is extremely active. Infrastructure could be upgraded." }
    ],
    establishedYear: 1955,
    type: "Public",
    accreditation: "NAAC A",
    website: "http://www.jaduniv.edu.in"
  },
  {
    name: "Manipal Institute of Technology (MIT)",
    location: "Manipal, Karnataka",
    fees: 325000,
    rating: 4.3,
    placements: 9.2,
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
    description: "Part of the Manipal Academy of Higher Education (MAHE), MIT Manipal is a top-tier private engineering college. Located in the beautiful coastal student-town of Manipal, it is famous for its student-run projects, excellent campus life, and top recruiters like Microsoft and Amazon.",
    courses: [
      "B.Tech Computer Science & Engineering",
      "B.Tech Data Science & Engineering",
      "B.Tech Aeronautical Engineering",
      "B.Tech Electronics & Communication",
      "M.Tech Software Engineering"
    ],
    reviews: [
      { author: "Nikhil Kamath", rating: 4.5, comment: "Best college life in India. Manipal is a beautiful student town. Placements for tech profiles are very good." },
      { author: "Shruti Hegde", rating: 4.1, comment: "Fees are high, but the hostel facilities, libraries, and lab infrastructure make it worth the investment." }
    ],
    establishedYear: 1957,
    type: "Private",
    accreditation: "NAAC A+",
    website: "https://manipal.edu/mit.html"
  },
  {
    name: "Netaji Subhas University of Technology (NSUT)",
    location: "New Delhi, Delhi",
    fees: 205000,
    rating: 4.4,
    placements: 13.9,
    image: "https://images.unsplash.com/photo-1527891751199-7225231a68dd?q=80&w=600&auto=format&fit=crop",
    description: "Formerly Netaji Subhas Institute of Technology (NSIT), NSUT is a premier state university located in Dwarka, New Delhi. Famous for its highly competitive coding environment and stellar placement outcomes, NSUT consistently produces top-tier developers and engineers.",
    courses: [
      "B.Tech Computer Science & Engineering",
      "B.Tech Electronics & Communication",
      "B.Tech Instrumentation & Control",
      "B.Tech Mathematics & Computing",
      "M.Tech Signal Processing"
    ],
    reviews: [
      { author: "Tanmay Singh", rating: 4.5, comment: "Outstanding coding culture. Almost all top product companies visit the campus for placements." },
      { author: "Priyanka Sen", rating: 4.3, comment: "Dwarka campus is green and well connected by metro. Great tech fests and coding contests." }
    ],
    establishedYear: 1983,
    type: "Public",
    accreditation: "NAAC A",
    website: "http://www.nsut.ac.in"
  },
  {
    name: "Thapar Institute of Engineering and Technology",
    location: "Patiala, Punjab",
    fees: 395000,
    rating: 4.2,
    placements: 8.9,
    image: "https://images.unsplash.com/photo-1607237138185-eedd996e5b09?q=80&w=600&auto=format&fit=crop",
    description: "Thapar Institute of Engineering and Technology is a prestigious private deemed university in Patiala, Punjab. With a beautiful 250-acre campus, Thapar provides world-class educational infrastructures and has active research collaborations with Trinity College Dublin.",
    courses: [
      "B.E. Computer Engineering",
      "B.E. Electronics & Computer Engineering",
      "B.E. Mechanical Engineering",
      "B.E. Civil Engineering",
      "M.E. Computer Science"
    ],
    reviews: [
      { author: "Gaurav Singh", rating: 4.3, comment: "Excellent infrastructure, libraries, and hostel facilities. Placements are very strong, especially in tech." },
      { author: "Harpreet Kaur", rating: 4.1, comment: "Expensive fees but the exposure and campus facilities are premium. Academic curriculum is well-updated." }
    ],
    establishedYear: 1956,
    type: "Private",
    accreditation: "NAAC A+",
    website: "https://www.thapar.edu"
  },
  {
    name: "PSG College of Technology",
    location: "Coimbatore, Tamil Nadu",
    fees: 85000,
    rating: 4.5,
    placements: 10.1,
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop",
    description: "PSG College of Technology is a government-aided private engineering institution in Coimbatore. Established in 1951, it is famous for its close integration with the manufacturing and textile industries of Coimbatore, providing extensive practical training to its students.",
    courses: [
      "B.E. Computer Science & Engineering",
      "B.E. Production Engineering",
      "B.E. Electrical & Electronics",
      "B.Tech Textile Technology",
      "M.Tech Product Design"
    ],
    reviews: [
      { author: "Arun Prasath", rating: 4.6, comment: "Extremely strong industrial training. PSG brand is highly respected in the south, yielding great placements." },
      { author: "Shalini M.", rating: 4.4, comment: "Strict academic schedule but the laboratory standards and alumni support are exceptional." }
    ],
    establishedYear: 1951,
    type: "Private",
    accreditation: "NAAC A",
    website: "https://www.psgtech.edu"
  },
  {
    name: "SRM Institute of Science and Technology",
    location: "Chennai, Tamil Nadu",
    fees: 250000,
    rating: 4.1,
    placements: 7.5,
    image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=600&auto=format&fit=crop",
    description: "SRM Institute of Science and Technology is a large private deemed university located in Kattankulathur, near Chennai. Boasting a huge student community and a massive campus, SRM is renowned for its international collaborations and campus recruitment drives.",
    courses: [
      "B.Tech Computer Science & Engineering",
      "B.Tech Aerospace Engineering",
      "B.Tech Electronics & Communication",
      "B.Tech Nanotechnology",
      "M.Tech IoT"
    ],
    reviews: [
      { author: "Manish Sharma", rating: 4.2, comment: "Very large campus. Excellent infrastructure and library. Good placement drives where many mass recruiters visit." },
      { author: "Aiswarya S.", rating: 4.0, comment: "Fabulous campus life and fests (Milan). High crowd size makes placements highly competitive, but opportunities are plenty." }
    ],
    establishedYear: 1985,
    type: "Private",
    accreditation: "NAAC A+",
    website: "https://www.srmist.edu.in"
  },
  {
    name: "Harcourt Butler Technical University (HBTU Kanpur)",
    location: "Kanpur, Uttar Pradesh",
    fees: 135000,
    rating: 4.2,
    placements: 8.2,
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop",
    description: "HBTU Kanpur is a public state university established in 1921. Known as one of the oldest technical institutions in northern India, HBTU has a long-standing reputation in chemical and paint technology, producing notable scientists and industrialists.",
    courses: [
      "B.Tech Chemical Engineering",
      "B.Tech Paint Technology",
      "B.Tech Computer Science & Engineering",
      "B.Tech Food Technology",
      "M.Tech Chemical Engineering"
    ],
    reviews: [
      { author: "Sanjay Tiwari", rating: 4.3, comment: "Famous for Chemical and Paint branches. The campus is historic, and the alumni are highly placed in MNCs." },
      { author: "Preeti Singh", rating: 4.1, comment: "Very strong academics. Campus life is quiet. Great placement outcomes for core chemical engineering." }
    ],
    establishedYear: 1921,
    type: "Public",
    accreditation: "NAAC A",
    website: "http://hbtu.ac.in"
  },
  {
    name: "International Institute of Information Technology (IIIT Hyderabad)",
    location: "Hyderabad, Telangana",
    fees: 360000,
    rating: 4.8,
    placements: 26.0,
    image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop",
    description: "IIIT Hyderabad is an autonomous research university in Gachibowli, Hyderabad. Famous for its research-focused curriculum right from the undergraduate level, IIIT Hyderabad consistently records some of the highest average placements package in India, rivaling the top IITs.",
    courses: [
      "B.Tech Computer Science & Engineering",
      "B.Tech Electronics & Communication",
      "Dual Degree CSE + MS Research",
      "M.Tech Computer Science",
      "Ph.D. Computer Vision"
    ],
    reviews: [
      { author: "Anirudh Reddy", rating: 4.9, comment: "Extreme focus on coding and research. The placements are unbelievable (avg 26-30 LPA). Best coding culture." },
      { author: "Kavya Murthy", rating: 4.7, comment: "Highly academic and hectic schedule. Coding culture is unmatched. Campus is relatively small but high quality." }
    ],
    establishedYear: 1998,
    type: "Private",
    accreditation: "NAAC A++",
    website: "https://www.iiit.ac.in"
  },
  {
    name: "RV College of Engineering (RVCE)",
    location: "Bangalore, Karnataka",
    fees: 225000,
    rating: 4.4,
    placements: 11.2,
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
    description: "RV College of Engineering is a private technical college in Bangalore, Karnataka. Located in the IT hub of India, RVCE is highly sought after by students and recruiters alike, offering top-tier training and placement opportunities in software and electronics.",
    courses: [
      "B.E. Computer Science & Engineering",
      "B.E. Information Science & Engineering",
      "B.E. Electronics & Communication",
      "B.E. Aerospace Engineering",
      "M.Tech Computer Science"
    ],
    reviews: [
      { author: "Shashi Kiran", rating: 4.5, comment: "Bangalore location gives us a massive edge for internships. Placements are solid, especially for CS and IS." },
      { author: "Pritha Sen", rating: 4.3, comment: "Strict academic rules (attendance is monitored), but college societies and placement record are excellent." }
    ],
    establishedYear: 1963,
    type: "Private",
    accreditation: "NAAC A",
    website: "https://rvce.edu.in"
  },
  {
    name: "College of Engineering, Guindy (Anna University)",
    location: "Chennai, Tamil Nadu",
    fees: 55000,
    rating: 4.5,
    placements: 9.5,
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop",
    description: "Established in 1794, College of Engineering, Guindy (CEG) is one of the oldest technical institutions in the world. Located in Chennai, CEG is a public university under Anna University and is highly regarded for its low fees, academic excellence, and distinguished alumni base.",
    courses: [
      "B.E. Computer Science & Engineering",
      "B.E. Electronics & Communication",
      "B.E. Biomedical Engineering",
      "B.E. Manufacturing Engineering",
      "M.B.A. Technology Management"
    ],
    reviews: [
      { author: "Ramesh Raj", rating: 4.6, comment: "CEG is a brand. Extremely low fees and highly prestigious. The campus is in the heart of Chennai." },
      { author: "Devi Selvam", rating: 4.4, comment: "Fabulous alumni network, great facilities, and high standard of core placements. Strict curriculum." }
    ],
    establishedYear: 1794,
    type: "Public",
    accreditation: "NAAC A++",
    website: "https://www.annauniv.edu"
  },
  {
    name: "Indian Institute of Information Technology Allahabad (IIIT Allahabad)",
    location: "Allahabad, Uttar Pradesh",
    fees: 180000,
    rating: 4.6,
    placements: 18.5,
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop",
    description: "IIIT Allahabad is a public university located in Jhalwa, Prayagraj. Known for its world-class computational infrastructure and intensive focus on information technology, IIIT-A consistently registers exceptional placement results in top-tier software and coding firms.",
    courses: [
      "B.Tech Information Technology",
      "B.Tech Electronics & Communication",
      "B.Tech Business Informatics",
      "M.Tech Software Engineering",
      "M.Tech Intelligent Systems"
    ],
    reviews: [
      { author: "Aditya Srivastava", rating: 4.7, comment: "Amazing coding culture. Top scores in Google Summer of Code and ACM-ICPC. Placements are top-tier." },
      { author: "Kriti Verma", rating: 4.5, comment: "Dwarka-style campus architecture, great laboratories. Prayagraj environment is quiet and perfect for studying." }
    ],
    establishedYear: 1999,
    type: "Public",
    accreditation: "NAAC A",
    website: "https://www.iiita.ac.in"
  }
];

async function main() {
  console.log("Start seeding...");

  // Clear existing records
  await prisma.favorite.deleteMany({});
  await prisma.recentlyViewed.deleteMany({});
  await prisma.comparison.deleteMany({});
  await prisma.college.deleteMany({});

  console.log("Deleted existing database records.");

  // Insert colleges
  for (const college of collegesData) {
    const created = await prisma.college.create({
      data: college,
    });
    console.log(`Created college: ${created.name} (${created.id})`);
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding database: ", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });