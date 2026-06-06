import student1 from "../../assets/images/Cardinal Students/Cardinal Student 1.jpg";
import student2 from "../../assets/images/Cardinal Students/Cardinal Student 2.png";
import student3 from "../../assets/images/Cardinal Students/Cardinal Student 3.jpeg";
import student4 from "../../assets/images/Cardinal Students/Cardinal Student 4.jpeg";
import student5 from "../../assets/images/Cardinal Students/Cardinal Student 5.jpeg";
import student6 from "../../assets/images/Cardinal Students/Cardinal Student 6.png";
import student7 from "../../assets/images/Cardinal Students/Cardinal Student 7.png";
import student8 from "../../assets/images/Cardinal Students/Cardinal Student 8.png";
import student9 from "../../assets/images/Cardinal Students/Cardinal Student 9.png";
import student10 from "../../assets/images/Cardinal Students/Cardinal Student 10.jpeg";
import student11 from "../../assets/images/Cardinal Students/Cardinal Student 11.jpeg";
import student12 from "../../assets/images/Cardinal Students/Cardinal Student 12.jpg";
import student13 from "../../assets/images/Cardinal Students/Cardinal Student 13.jpeg";
import student14 from "../../assets/images/Cardinal Students/Cardinal Student 14.jpeg";
import student15 from "../../assets/images/Cardinal Students/Cardinal Student 15.jpeg";
import student16 from "../../assets/images/Cardinal Students/Cardinal Student 16.jpg";
import student17 from "../../assets/images/Cardinal Students/Cardinal Student 17.png";
import student18 from "../../assets/images/Cardinal Students/Cardinal Student 18.png";
import student19 from "../../assets/images/Cardinal Students/Cardinal Student 19.png";
import student20 from "../../assets/images/Cardinal Students/Cardinal Student 20.jpeg";
import studentAlt16 from "../../assets/images/Cardinal Students/Cardinal Studnet 16.jpeg";
import professional1 from "../../assets/images/Cardinal Professional/Cardinal Professional 1.jpeg";
import professional2 from "../../assets/images/Cardinal Professional/Cardinal Professional 2.jpeg";
import professional3 from "../../assets/images/Cardinal Professional/Cardinal Professional 3.jpg";
import professional4 from "../../assets/images/Cardinal Professional/Cardinal Professional 4.jpg";
import professional5 from "../../assets/images/Cardinal Professional/Cardinal Professional 5.jpg";
import professional6 from "../../assets/images/Cardinal Professional/Cardinal Professional 6.png";
import professionalTeam from "../../assets/images/Cardinal Professional/Cardinal Team.png";
import institutional1 from "../../assets/images/Cardinal Institutional/Cardinal Institutional 1.png";
import institutional2 from "../../assets/images/Cardinal Institutional/Cardinal Institutional 2.png";
import institutional3 from "../../assets/images/Cardinal Institutional/Cardianl Institutional 3.jpg";

export type ProgramCategory = "student" | "professional" | "institutional";

export const studentImages = [
  student1,
  student2,
  student3,
  student4,
  student5,
  student6,
  student7,
  student8,
  student9,
  student10,
  student11,
  student12,
  student13,
  student14,
  student15,
  student16,
  student17,
  student18,
  student19,
  student20,
  studentAlt16,
] as const;

export const professionalImages = [
  professional1,
  professional2,
  professional3,
  professional4,
  professional5,
  professional6,
  professionalTeam,
] as const;

export const institutionalImages = [
  institutional1,
  institutional2,
  institutional3,
] as const;

const programImageSets = {
  student: studentImages,
  professional: professionalImages,
  institutional: institutionalImages,
} as const;

export function getProgramImage(
  category: ProgramCategory,
  seed: number | string = 0,
) {
  const images = programImageSets[category];
  const numericSeed =
    typeof seed === "number"
      ? seed
      : Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return images[Math.abs(numericSeed) % images.length];
}

