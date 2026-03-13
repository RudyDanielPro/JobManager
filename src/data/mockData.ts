export type UserRole = "RECRUITER" | "CANDIDATE";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  location?: string;
  bio?: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  description: string;
  recruiterId: string;
}

export interface JobOffer {
  id: string;
  title: string;
  description: string;
  companyId: string;
  location: string;
  salary: string;
  postedAt: string;
  tags: string[];
  type: string;
}

export interface Application {
  id: string;
  jobOfferId: string;
  candidateId: string;
  cvFileName: string;
  coverLetter: string;
  status: "PENDING" | "REVIEWED" | "ACCEPTED" | "REJECTED";
  appliedAt: string;
}

export const users: User[] = [
  { id: "u1", name: "Carlos Méndez", email: "carlos@technova.com", password: "123456", role: "RECRUITER", avatar: "CM", phone: "+34 612 345 678", location: "Madrid, España", bio: "Reclutador con 8 años de experiencia en el sector tech." },
  { id: "u2", name: "Ana García", email: "ana@gmail.com", password: "123456", role: "CANDIDATE", avatar: "AG", phone: "+34 698 765 432", location: "Barcelona, España", bio: "Desarrolladora frontend apasionada por React y el diseño de interfaces." },
  { id: "u3", name: "Luis Torres", email: "luis@gmail.com", password: "123456", role: "CANDIDATE", avatar: "LT", phone: "+34 654 321 987", location: "Valencia, España", bio: "Ingeniero backend con experiencia en Node.js y microservicios." },
];

export const companies: Company[] = [
  { id: "c1", name: "TechNova", logo: "TN", description: "Startup de IA con sede en Madrid. Desarrollamos soluciones de machine learning para empresas.", recruiterId: "u1" },
  { id: "c2", name: "CloudBridge", logo: "CB", description: "Consultora cloud especializada en AWS y Azure.", recruiterId: "u1" },
  { id: "c3", name: "DataPulse", logo: "DP", description: "Plataforma de análisis de datos en tiempo real.", recruiterId: "u1" },
];

export const jobOffers: JobOffer[] = [
  { id: "j1", title: "Senior React Developer", description: "Buscamos un desarrollador React con más de 5 años de experiencia para liderar el desarrollo de nuestra plataforma SaaS. Trabajarás con TypeScript, Next.js y GraphQL en un equipo ágil de alto rendimiento. Responsabilidades incluyen diseño de arquitectura frontend, revisión de código y mentoría a desarrolladores junior.", companyId: "c1", location: "Madrid, España (Remoto)", salary: "55.000€ - 70.000€", postedAt: "2026-03-10", tags: ["React", "TypeScript", "Next.js", "GraphQL"], type: "Tiempo completo" },
  { id: "j2", title: "Backend Engineer (Node.js)", description: "Únete a nuestro equipo backend para construir microservicios escalables con Node.js y PostgreSQL. Experiencia en Docker y Kubernetes es un plus.", companyId: "c2", location: "Barcelona, España", salary: "45.000€ - 60.000€", postedAt: "2026-03-09", tags: ["Node.js", "PostgreSQL", "Docker", "Kubernetes"], type: "Tiempo completo" },
  { id: "j3", title: "Data Scientist", description: "Analizarás grandes volúmenes de datos y construirás modelos predictivos usando Python y TensorFlow para mejorar nuestros productos de analytics.", companyId: "c3", location: "Remoto (EU)", salary: "50.000€ - 65.000€", postedAt: "2026-03-08", tags: ["Python", "TensorFlow", "SQL", "Machine Learning"], type: "Tiempo completo" },
  { id: "j4", title: "DevOps Engineer", description: "Gestión de infraestructura cloud, pipelines CI/CD y automatización. Experiencia en Terraform y AWS requerida.", companyId: "c1", location: "Madrid, España", salary: "48.000€ - 62.000€", postedAt: "2026-03-07", tags: ["AWS", "Terraform", "CI/CD", "Linux"], type: "Tiempo completo" },
  { id: "j5", title: "UI/UX Designer", description: "Diseño de interfaces para aplicaciones web y móviles. Dominio de Figma y conocimientos de sistemas de diseño.", companyId: "c2", location: "Valencia, España (Híbrido)", salary: "35.000€ - 48.000€", postedAt: "2026-03-06", tags: ["Figma", "UI/UX", "Design Systems", "Prototyping"], type: "Tiempo completo" },
  { id: "j6", title: "Full Stack Developer", description: "Desarrollo de aplicaciones completas con React en el frontend y Spring Boot en el backend. Integración con APIs REST y bases de datos relacionales.", companyId: "c3", location: "Sevilla, España", salary: "42.000€ - 55.000€", postedAt: "2026-03-05", tags: ["React", "Spring Boot", "Java", "REST API"], type: "Tiempo completo" },
  { id: "j7", title: "Mobile Developer (React Native)", description: "Desarrollo de aplicaciones móviles multiplataforma con React Native. Publicación en App Store y Google Play.", companyId: "c1", location: "Remoto", salary: "40.000€ - 55.000€", postedAt: "2026-03-04", tags: ["React Native", "TypeScript", "iOS", "Android"], type: "Tiempo completo" },
  { id: "j8", title: "QA Automation Engineer", description: "Diseño e implementación de frameworks de testing automatizado con Cypress y Playwright.", companyId: "c2", location: "Madrid, España (Remoto)", salary: "38.000€ - 50.000€", postedAt: "2026-03-03", tags: ["Cypress", "Playwright", "Jest", "Testing"], type: "Tiempo completo" },
  { id: "j9", title: "Product Manager", description: "Gestión del roadmap de producto, priorización de features y coordinación entre equipos técnicos y stakeholders.", companyId: "c3", location: "Barcelona, España", salary: "50.000€ - 68.000€", postedAt: "2026-03-02", tags: ["Agile", "Scrum", "Jira", "Product Strategy"], type: "Tiempo completo" },
  { id: "j10", title: "Cybersecurity Analyst", description: "Monitorización de amenazas, auditorías de seguridad y respuesta a incidentes. Certificaciones CISSP o CEH valoradas.", companyId: "c1", location: "Madrid, España", salary: "45.000€ - 60.000€", postedAt: "2026-03-01", tags: ["Security", "SIEM", "Pentesting", "Firewalls"], type: "Tiempo completo" },
  { id: "j11", title: "Cloud Architect", description: "Diseño de soluciones cloud escalables y seguras en entornos multi-cloud. Liderazgo técnico en migraciones.", companyId: "c2", location: "Remoto (EU)", salary: "65.000€ - 85.000€", postedAt: "2026-02-28", tags: ["AWS", "Azure", "GCP", "Architecture"], type: "Tiempo completo" },
  { id: "j12", title: "Machine Learning Engineer", description: "Desarrollo y despliegue de modelos ML en producción. Experiencia en MLOps y pipelines de datos.", companyId: "c3", location: "Madrid, España (Híbrido)", salary: "55.000€ - 75.000€", postedAt: "2026-02-27", tags: ["Python", "PyTorch", "MLOps", "Docker"], type: "Tiempo completo" },
  { id: "j13", title: "Technical Writer", description: "Creación de documentación técnica, guías de API y tutoriales para desarrolladores.", companyId: "c1", location: "Remoto", salary: "30.000€ - 42.000€", postedAt: "2026-02-26", tags: ["Documentation", "API", "Markdown", "Technical Writing"], type: "Media jornada" },
  { id: "j14", title: "Scrum Master", description: "Facilitación de ceremonias ágiles, eliminación de impedimentos y coaching al equipo de desarrollo.", companyId: "c2", location: "Bilbao, España", salary: "40.000€ - 52.000€", postedAt: "2026-02-25", tags: ["Scrum", "Kanban", "Agile", "Coaching"], type: "Tiempo completo" },
  { id: "j15", title: "Blockchain Developer", description: "Desarrollo de smart contracts en Solidity y aplicaciones descentralizadas (dApps).", companyId: "c3", location: "Remoto", salary: "55.000€ - 80.000€", postedAt: "2026-02-24", tags: ["Solidity", "Ethereum", "Web3", "Smart Contracts"], type: "Freelance" },
];

export const applications: Application[] = [
  { id: "a1", jobOfferId: "j1", candidateId: "u2", cvFileName: "cv_ana_garcia.pdf", coverLetter: "Me apasiona React y tengo 4 años de experiencia...", status: "REVIEWED", appliedAt: "2026-03-11" },
  { id: "a2", jobOfferId: "j3", candidateId: "u2", cvFileName: "cv_ana_garcia.pdf", coverLetter: "Tengo experiencia en análisis de datos con Python...", status: "PENDING", appliedAt: "2026-03-10" },
  { id: "a3", jobOfferId: "j2", candidateId: "u3", cvFileName: "cv_luis_torres.pdf", coverLetter: "Soy un desarrollador backend con experiencia en Node.js...", status: "ACCEPTED", appliedAt: "2026-03-09" },
  { id: "a4", jobOfferId: "j7", candidateId: "u3", cvFileName: "cv_luis_torres.pdf", coverLetter: "He desarrollado varias apps con React Native...", status: "REJECTED", appliedAt: "2026-03-08" },
];

export function getCompanyById(id: string): Company | undefined {
  return companies.find((c) => c.id === id);
}

export function getJobById(id: string): JobOffer | undefined {
  return jobOffers.find((j) => j.id === id);
}

export function getApplicationsForCandidate(candidateId: string): (Application & { job?: JobOffer; company?: Company })[] {
  return applications
    .filter((a) => a.candidateId === candidateId)
    .map((a) => {
      const job = getJobById(a.jobOfferId);
      const company = job ? getCompanyById(job.companyId) : undefined;
      return { ...a, job, company };
    });
}

export function getApplicationsForJob(jobOfferId: string): (Application & { candidate?: User })[] {
  return applications
    .filter((a) => a.jobOfferId === jobOfferId)
    .map((a) => {
      const candidate = users.find((u) => u.id === a.candidateId);
      return { ...a, candidate };
    });
}

export function getJobsForRecruiter(recruiterId: string): (JobOffer & { company?: Company; applicationCount: number })[] {
  const recruiterCompanies = companies.filter((c) => c.recruiterId === recruiterId);
  const companyIds = recruiterCompanies.map((c) => c.id);
  return jobOffers
    .filter((j) => companyIds.includes(j.companyId))
    .map((j) => ({
      ...j,
      company: getCompanyById(j.companyId),
      applicationCount: applications.filter((a) => a.jobOfferId === j.id).length,
    }));
}
