import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing records
  await prisma.favorite.deleteMany({});
  await prisma.college.deleteMany({});
  await prisma.user.deleteMany({});

  const collegesData = [
    {
      name: "Indian Institute of Technology, Bombay (IITB)",
      location: "Mumbai, Maharashtra",
      fees: 220000,
      rating: 4.9,
      placements: 21.82,
      image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80",
      description: "Indian Institute of Technology Bombay is a premier public technical and research university located in Powai, Mumbai. Established in 1958, it is renowned globally for its engineering education, cutting-edge research, and top-tier placement records.",
      courses: [
        "B.Tech Computer Science and Engineering",
        "B.Tech Electrical Engineering",
        "B.Tech Mechanical Engineering",
        "M.Tech Microelectronics",
        "M.Sc Chemistry"
      ],
      reviews: [
        { author: "Rohan Mehta", rating: 5, comment: "Unmatched academic environment, peer group, and campus life. Best coding culture and startup ecosystem." },
        { author: "Sneha Patel", rating: 4.8, comment: "Top-notch professors and resources. Placement is exceptionally high, though academic load can be intense." }
      ],
      establishedYear: 1958,
      type: "Public",
      accreditation: "NAAC A++",
      website: "https://www.iitb.ac.in"
    },
    {
      name: "Indian Institute of Technology, Delhi (IITD)",
      location: "New Delhi, Delhi",
      fees: 225000,
      rating: 4.8,
      placements: 20.50,
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80",
      description: "Located in the capital of India, IIT Delhi is one of the premier public research universities in the country. It is known for its prestigious campus, stellar alumni network, and deep industry collaborations.",
      courses: [
        "B.Tech Computer Science and Engineering",
        "B.Tech Mathematics and Computing",
        "B.Tech Chemical Engineering",
        "M.Tech VLSI Design Tools",
        "MBA Management"
      ],
      reviews: [
        { author: "Vikas Kumar", rating: 4.9, comment: "Amazing faculty and the brand value is unmatched. Placement season is organized perfectly with top multinational tech giants." },
        { author: "Anjali Gupta", rating: 4.7, comment: "Great research labs and hostel life. Excellent location in south Delhi. Lots of extracurricular clubs." }
      ],
      establishedYear: 1961,
      type: "Public",
      accreditation: "NAAC A++",
      website: "https://home.iitd.ac.in"
    },
    {
      name: "Indian Institute of Technology, Madras (IITM)",
      location: "Chennai, Tamil Nadu",
      fees: 215000,
      rating: 4.9,
      placements: 22.10,
      image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=600&q=80",
      description: "IIT Madras is consistently ranked as the #1 engineering institute in India by NIRF. Known for its massive, lush green campus that features a national park, the institute excels in technical innovation, entrepreneurship, and research.",
      courses: [
        "B.Tech Computer Science and Engineering",
        "B.Tech Aerospace Engineering",
        "B.Tech Civil Engineering",
        "M.Tech Data Science",
        "Ph.D Physics"
      ],
      reviews: [
        { author: "Karthik Raja", rating: 5, comment: "Excellent research facilities and a sprawling campus filled with deer and monkeys. Placement is top class." },
        { author: "Deepika R.", rating: 4.8, comment: "Academic rigour is very high. Safe, beautiful campus. Incredible support for student startups through IITM Research Park." }
      ],
      establishedYear: 1959,
      type: "Public",
      accreditation: "NAAC A++",
      website: "https://www.iitm.ac.in"
    },
    {
      name: "Birla Institute of Technology and Science, Pilani (BITS)",
      location: "Pilani, Rajasthan",
      fees: 550000,
      rating: 4.7,
      placements: 18.20,
      image: "https://images.unsplash.com/photo-1607237138185-eedd996c5c0c?auto=format&fit=crop&w=600&q=80",
      description: "BITS Pilani is India's top-tier private university known for its unique zero-attendance policy, strong emphasis on entrepreneurship, and the famous 'Practice School' internship program.",
      courses: [
        "B.E. Computer Science",
        "B.E. Electronics & Communication",
        "M.Sc Economics (Dual Degree)",
        "M.E. Software Systems",
        "MBA Business Analytics"
      ],
      reviews: [
        { author: "Aditya Sen", rating: 4.8, comment: "No attendance policy gives you freedom to pursue your passion. BITSians network is incredibly strong. Placements are on par with top IITs." },
        { author: "Pooja Sharma", rating: 4.6, comment: "Fees are on the higher side but the ROI is excellent. Practice School (PS-II) provides assured 6 months industry exposure." }
      ],
      establishedYear: 1964,
      type: "Private",
      accreditation: "NAAC A",
      website: "https://www.bits-pilani.ac.in"
    },
    {
      name: "Delhi Technological University (DTU)",
      location: "Rohini, Delhi",
      fees: 219000,
      rating: 4.5,
      placements: 15.60,
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80",
      description: "Formerly known as Delhi College of Engineering (DCE), DTU is a premier state public university in Delhi. It is historically known for its strong technical education, massive alumni network, and vibrant cultural fests.",
      courses: [
        "B.Tech Computer Engineering",
        "B.Tech Software Engineering",
        "B.Tech Information Technology",
        "M.Tech Computer Science",
        "MBA Finance"
      ],
      reviews: [
        { author: "Rahul Verma", rating: 4.6, comment: "Amazing placement season. Tech companies visit in huge numbers. Campus is large and has great sports facilities." },
        { author: "Nikita Kapoor", rating: 4.4, comment: "DCE legacy is massive. Faculty is helpful but sometimes academic administration is slow. College fests are the best in Delhi." }
      ],
      establishedYear: 1941,
      type: "Public",
      accreditation: "NAAC A",
      website: "http://www.dtu.ac.in"
    },
    {
      name: "Vellore Institute of Technology (VIT)",
      location: "Vellore, Tamil Nadu",
      fees: 198000,
      rating: 4.2,
      placements: 9.20,
      image: "https://images.unsplash.com/photo-1527891751199-7225231a68dd?auto=format&fit=crop&w=600&q=80",
      description: "VIT Vellore is one of the largest and most popular private engineering institutions in India. It features state-of-the-art infrastructure, a flexible credit system (FFCS), and a diverse student community from all states.",
      courses: [
        "B.Tech Computer Science and Engineering",
        "B.Tech Information Technology",
        "B.Tech Biotechnology",
        "M.Tech Cloud Computing",
        "MCA Computer Applications"
      ],
      reviews: [
        { author: "Divya Nair", rating: 4.3, comment: "Infrastructure is beautiful. FFCS allows you to choose your own teachers and slots. Placements are very structured with thousands of offers." },
        { author: "Aman Preet", rating: 4.1, comment: "Strict rules in hostels, but great exposure. Coding clubs are highly active. Placements are good if you maintain a high CGPA." }
      ],
      establishedYear: 1984,
      type: "Private",
      accreditation: "NAAC A++",
      website: "https://vit.ac.in"
    },
    {
      name: "National Institute of Technology, Trichy (NITT)",
      location: "Tiruchirappalli, Tamil Nadu",
      fees: 145000,
      rating: 4.6,
      placements: 16.50,
      image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80",
      description: "NIT Trichy is consistently ranked as the top National Institute of Technology in India. It offers exceptional academic programs, a vibrant campus culture, and high recruitment percentages by Fortune 500 companies.",
      courses: [
        "B.Tech Computer Science and Engineering",
        "B.Tech Electronics & Comm Engineering",
        "B.Tech Production Engineering",
        "M.Tech Power Electronics",
        "MCA"
      ],
      reviews: [
        { author: "Siddharth S.", rating: 4.7, comment: "Best NIT in the country. Excellent coding culture, fest seasons (Pragyan & Festember) are huge, and packages are very competitive." },
        { author: "Meera Krishnan", rating: 4.5, comment: "Vast campus, highly experienced professors. Very affordable fees compared to private institutions, making it highly valuable." }
      ],
      establishedYear: 1964,
      type: "Public",
      accreditation: "NAAC A+",
      website: "https://www.nitt.edu"
    },
    {
      name: "National Institute of Technology, Surathkal (NITK)",
      location: "Mangaluru, Karnataka",
      fees: 150000,
      rating: 4.6,
      placements: 17.10,
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
      description: "NITK Surathkal is uniquely positioned right next to the Arabian Sea, featuring its own private beach. It is renowned for top-tier academic research and extremely high placements in core and software sectors.",
      courses: [
        "B.Tech Information Technology",
        "B.Tech Computer Science and Engineering",
        "B.Tech Metallurgical & Materials Engineering",
        "M.Tech Marine Structures",
        "M.Tech Information Security"
      ],
      reviews: [
        { author: "Akshay Bhat", rating: 4.8, comment: "Having a beach right on the campus makes college life magical. Placements are amazing, especially in IT branches." },
        { author: "Shruti Hegde", rating: 4.4, comment: "Great research environment, good lab facilities, and highly supportive seniors. Mess food is decent." }
      ],
      establishedYear: 1960,
      type: "Public",
      accreditation: "NAAC A+",
      website: "https://www.nitk.ac.in"
    },
    {
      name: "Manipal Institute of Technology (MIT)",
      location: "Manipal, Karnataka",
      fees: 485000,
      rating: 4.3,
      placements: 12.59,
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80",
      description: "MIT Manipal is a premier private engineering college. Part of the Manipal Academy of Higher Education, it is widely recognized for its high-quality campus life, modern infrastructure, and notable alumni like Satya Nadella.",
      courses: [
        "B.Tech Computer Science and Engineering",
        "B.Tech Aeronautical Engineering",
        "B.Tech Data Science",
        "M.Tech Software Engineering",
        "M.Tech Microelectronics"
      ],
      reviews: [
        { author: "Ishaan Rao", rating: 4.4, comment: "Campus life here is legendary. World class sports complex (Marena), absolute freedom, and good industry connections." },
        { author: "Kriti Sharma", rating: 4.2, comment: "Expensive fees but college provides premium facilities and high-quality crowd. Good opportunities in research and placements." }
      ],
      establishedYear: 1957,
      type: "Private",
      accreditation: "NAAC A++",
      website: "https://manipal.edu/mit"
    },
    {
      name: "Jadavpur University",
      location: "Kolkata, West Bengal",
      fees: 10000,
      rating: 4.5,
      placements: 14.80,
      image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=600&q=80",
      description: "Jadavpur University is a state public university located in Kolkata, highly regarded for having the lowest fees in India while delivering average placements comparable to top-tier national institutes.",
      courses: [
        "B.E. Computer Science and Engineering",
        "B.E. Electronics & Telecommunication",
        "B.E. Power Engineering",
        "M.E. Control Systems",
        "M.A. English"
      ],
      reviews: [
        { author: "Subhashis Dey", rating: 4.8, comment: "Unbelievably low fees (around 10k for 4 years). Excellent placements. Coding community is very strong." },
        { author: "Riya Sen", rating: 4.2, comment: "Infrastructure could be modernized and there are political rallies, but academic and research quality is exceptional." }
      ],
      establishedYear: 1955,
      type: "Public",
      accreditation: "NAAC A",
      website: "http://www.jaduniv.edu.in"
    },
    {
      name: "RV College of Engineering (RVCE)",
      location: "Bengaluru, Karnataka",
      fees: 250000,
      rating: 4.3,
      placements: 11.20,
      image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5c?auto=format&fit=crop&w=600&q=80",
      description: "RVCE is a top-ranked private autonomous engineering college in Bengaluru. Benefiting from its location in the Silicon Valley of India, it provides unparalleled industry access and high placements in tech.",
      courses: [
        "B.E. Computer Science and Engineering",
        "B.E. Information Science and Engineering",
        "B.E. Electronics & Communication",
        "M.Tech Computer Science",
        "M.Tech Product Design"
      ],
      reviews: [
        { author: "Sanjay Kumar", rating: 4.4, comment: "Location advantage is huge. Almost all top tech and product companies visit RVCE. Placements are very high." },
        { author: "Aishwarya M.", rating: 4.2, comment: "Campus is slightly small and academic rules are strictly followed. But ROI is great if admitted via KCET." }
      ],
      establishedYear: 1963,
      type: "Private",
      accreditation: "NBA Accredited",
      website: "https://www.rvce.edu.in"
    },
    {
      name: "Thapar Institute of Engineering and Technology",
      location: "Patiala, Punjab",
      fees: 460000,
      rating: 4.2,
      placements: 10.50,
      image: "https://images.unsplash.com/photo-1598981457915-aea220950616?auto=format&fit=crop&w=600&q=80",
      description: "Thapar University is a premium private deemed-to-be-university in Patiala. It is known for its beautiful modern architecture, state-of-the-art laboratory infrastructure, and wide recruitment drives.",
      courses: [
        "B.Tech Computer Science and Engineering",
        "B.Tech Electronics & Computers",
        "B.Tech Mechanical Engineering",
        "M.Tech Structural Engineering",
        "Ph.D Computer Science"
      ],
      reviews: [
        { author: "Harpreet Singh", rating: 4.3, comment: "Campus infrastructure is amazing, equivalent to foreign universities. Placements are solid for tech branches." },
        { author: "Tanya Sharma", rating: 4.1, comment: "Fees are high, but hostel facilities and library are outstanding. Placement support is very good." }
      ],
      establishedYear: 1956,
      type: "Private",
      accreditation: "NAAC A+",
      website: "https://www.thapar.edu"
    },
    {
      name: "College of Engineering, Guindy (CEG)",
      location: "Chennai, Tamil Nadu",
      fees: 55000,
      rating: 4.5,
      placements: 11.80,
      image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=600&q=80",
      description: "Established in 1794, CEG is one of the oldest technical institutions in Asia. Affiliated with Anna University, it provides premium quality education with highly nominal fees and strong placements.",
      courses: [
        "B.E. Computer Science and Engineering",
        "B.E. Electronics & Communication",
        "B.E. Information Technology",
        "M.E. Applied Electronics",
        "MBA Systems"
      ],
      reviews: [
        { author: "Manoj Kumar", rating: 4.6, comment: "Rich history and beautiful campus in the center of Chennai. Extremely affordable fees and very high reputation." },
        { author: "Priyan T.", rating: 4.4, comment: "Outstanding professors. Placements are great but the curriculum can feel traditional compared to private autonomous colleges." }
      ],
      establishedYear: 1794,
      type: "Public",
      accreditation: "NAAC A++",
      website: "https://www.annauniv.edu"
    },
    {
      name: "SRM Institute of Science and Technology",
      location: "Kattankulathur, Tamil Nadu",
      fees: 260000,
      rating: 4.0,
      placements: 7.50,
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80",
      description: "SRM IST Kattankulathur is a massive private university near Chennai. It is popular for its high diversity of students, active participation in space and satellite programs, and large-scale placements.",
      courses: [
        "B.Tech Computer Science and Engineering",
        "B.Tech Software Engineering",
        "B.Tech Aerospace Engineering",
        "M.Tech Internet of Things",
        "MBA Human Resources"
      ],
      reviews: [
        { author: "Abhishek Lal", rating: 4.1, comment: "Very large campus, great fests (Aaruush & Milan), and high placement rate for IT. Thousands of companies visit." },
        { author: "Shalini Sinha", rating: 3.9, comment: "The intake of students is very high, which creates intense competition during placements. Infrastructure is top class." }
      ],
      establishedYear: 1985,
      type: "Private",
      accreditation: "NAAC A++",
      website: "https://www.srmist.edu.in"
    },
    {
      name: "Peshawar College of Engineering & Research (PCER)",
      location: "Pune, Maharashtra",
      fees: 185000,
      rating: 4.1,
      placements: 8.20,
      image: "https://images.unsplash.com/photo-1568790308560-fc100f244199?auto=format&fit=crop&w=600&q=80",
      description: "PCER Pune is a private technical institute established in Pune. It has developed a strong reputation for practical pedagogy and strong regional collaborations with manufacturing and IT industries.",
      courses: [
        "B.E. Computer Engineering",
        "B.E. Electronics & Telecommunication",
        "B.E. Mechanical Engineering",
        "M.E. Design Engineering"
      ],
      reviews: [
        { author: "Swapnil Joshi", rating: 4.2, comment: "Pune location provides excellent weather and exposure to nearby IT hubs (Hinjewadi). Placement is consistent." },
        { author: "Preeti Deshpande", rating: 4.0, comment: "Faculty is friendly. The laboratory facilities are well-equipped. Fees are average." }
      ],
      establishedYear: 1999,
      type: "Private",
      accreditation: "NAAC A",
      website: "http://www.pcerpune.edu"
    },
    {
      name: "Amrita School of Engineering",
      location: "Coimbatore, Tamil Nadu",
      fees: 280000,
      rating: 4.2,
      placements: 9.10,
      image: "https://images.unsplash.com/photo-1525921429624-479b6c294521?auto=format&fit=crop&w=600&q=80",
      description: "Amrita School of Engineering is part of Amrita Vishwa Vidyapeetham, a multi-campus private university. Renowned for its strict discipline, values-based education, and high-impact research output.",
      courses: [
        "B.Tech Computer Science and Engineering",
        "B.Tech Artificial Intelligence",
        "B.Tech Cyber Security",
        "M.Tech Cybersecurity"
      ],
      reviews: [
        { author: "Vivek Nair", rating: 4.3, comment: "Spiritual and disciplined campus. Excellent green surroundings. Core software placements are strong with top tech firms visiting." },
        { author: "Ananya Iyer", rating: 4.1, comment: "Strict attendance rules and dress codes. But research publications and global tie-ups are top notch." }
      ],
      establishedYear: 1994,
      type: "Private",
      accreditation: "NAAC A++",
      website: "https://www.amrita.edu"
    }
  ];

  console.log("Seeding sample colleges...");

  for (const college of collegesData) {
    const createdCollege = await prisma.college.create({
      data: {
        name: college.name,
        location: college.location,
        fees: college.fees,
        rating: college.rating,
        placements: college.placements,
        image: college.image,
        description: college.description,
        courses: college.courses,
        reviews: college.reviews,
        establishedYear: college.establishedYear,
        type: college.type,
        accreditation: college.accreditation,
        website: college.website,
      },
    });
    console.log(`Created college: ${createdCollege.name} (${createdCollege.id})`);
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
