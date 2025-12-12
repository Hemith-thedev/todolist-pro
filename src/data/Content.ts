import { Category } from "./Types"

// export const PredefinedCategories: Category[] = [
//   {
//     id: 1,
//     label: "Personal",
//     color: "hsl(220, 100%, 80%)"
//   },
//   {
//     id: 2,
//     label: "Work",
//     color: "hsl(30, 100%, 80%)"
//   },
//   {
//     id: 3,
//     label: "Family",
//     color: "hsl(150, 100%, 80%)"
//   },
//   {
//     id: 4,
//     label: "Health",
//     color: "hsl(200, 100%, 80%)"
//   },
//   {
//     id: 5,
//     label: "Shopping",
//     color: "hsl(300, 100%, 80%)"
//   }
// ]

export const PredefinedCategories = [
  {
    id: 1,
    label: "Personal",
    color: "hsl(220, 100%, 60%)"
  },
  {
    id: 2,
    label: "Work",
    color: "hsl(0, 100%, 60%)"
  },
  {
    id: 3,
    label: "Family",
    color: "hsl(320, 100%, 50%)"
  },
  {
    id: 4,
    label: "Health",
    color: "hsl(30, 100%, 60%)"
  },
  {
    id: 5,
    label: "Shopping",
    color: "hsl(140, 100%, 70%)"
  }
]

localStorage.setItem("todolistpro-user-categories", JSON.stringify(PredefinedCategories))



// const [colors] = useState<{ id: number; label: string; color: string }[]>([
//   { id: 1, label: "Red", color: "hsl(0, 100%, 60%)" },
//   { id: 2, label: "Orange", color: "hsl(30, 100%, 60%)" },
//   { id: 3, label: "Yellow", color: "hsl(60, 100%, 70%)" },
//   { id: 4, label: "Lime", color: "hsl(90, 100%, 70%)" },
//   { id: 5, label: "Green", color: "hsl(140, 100%, 50%)" },
//   { id: 6, label: "Cyan", color: "hsl(180, 100%, 70%)" },
//   { id: 7, label: "Blue", color: "hsl(220, 100%, 60%)" },
//   { id: 8, label: "Violet", color: "hsl(270, 100%, 70%)" },
//   { id: 9, label: "Magenta", color: "hsl(300, 100%, 70%)" },
//   { id: 10, label: "Pink", color: "hsl(320, 100%, 70%)" },
// ]);

export const colors: { id: number; label: string; color: string }[] = [
  { id: 1, label: "Red", color: "hsl(0, 100%, 60%)" },
  { id: 2, label: "Orange", color: "hsl(30, 100%, 60%)" },
  { id: 3, label: "Green", color: "hsl(140, 100%, 50%)" },
  { id: 4, label: "Blue", color: "hsl(220, 100%, 60%)" },
  { id: 5, label: "Pink", color: "hsl(320, 100%, 70%)" },
];