"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAndAnalyzeRecipe } from "@/app/actions";
import { Button } from "../ui";
import { useTransition } from "react";
import { Card } from "../shared";
import toast from "react-hot-toast";

const schema = z.object({
  recipeName: z.string().min(3, "Назва має бути довшою"),
  ingredientsText: z.string().min(10, "Опиши інгредієнти детальніше"),
});

type Schema = z.infer<typeof schema>;

export function CreateRecipeForm() {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: Schema) => {
    startTransition(async () => {
      const result = await createAndAnalyzeRecipe(data);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Рецепт успішно створено!");
        reset();
      }
    });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="z-50">
        <h2 className="text-xl font-semibold">Створити новий рецепт</h2>

        <div>
          <label
            htmlFor="recipeName"
            className="block text-sm font-medium text-gray-700"
          >
            Назва рецепта
          </label>
          <input
            {...register("recipeName")}
            id="recipeName"
            className="w-full p-2 border rounded-md mt-1"
          />
          {errors.recipeName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.recipeName.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="ingredientsText"
            className="block text-sm font-medium text-gray-700"
          >
            Інгредієнти (кожен з нової строки, з вагою)
          </label>
          <textarea
            {...register("ingredientsText")}
            id="ingredientsText"
            rows={6}
            className="w-full p-2 border rounded-md mt-1"
            placeholder={`Наприклад:\n150г курячого філе\n200г рису\n50г моркви`}
          />
          {errors.ingredientsText && (
            <p className="text-red-500 text-sm mt-1">
              {errors.ingredientsText.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Аналіз та збереження..." : "Зберегти рецепт"}
        </Button>
      </form>
    </Card>
  );
}

// "use client";

// import React, { useState, useTransition } from "react";
// import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { createAndAnalyzeRecipe } from "@/app/actions";
// import { Button } from "@/components/ui/button"; // Перевірте шлях до ваших UI компонентів
// import { Card } from "@/components/shared/card"; // Перевірте шлях до ваших UI компонентів
// import toast from "react-hot-toast";

// // --- Схема та Тип для СТРУКТУРОВАНОЇ форми ---
// const structuredIngredientSchema = z.object({
//   name: z.string().min(2, "Введіть назву"),
//   quantity: z.coerce
//     .number({ invalid_type_error: "Число" })
//     .positive("К-сть > 0"),
//   unit: z.string(),
// });
// const structuredSchema = z.object({
//   recipeName: z.string().min(3, "Назва має бути довгою"),
//   ingredients: z
//     .array(structuredIngredientSchema)
//     .min(1, "Додайте хоча б один інгредієнт"),
// });
// type StructuredSchema = z.infer<typeof structuredSchema>;

// // --- Схема та Тип для ТЕКСТОВОЇ форми ---
// const textSchema = z.object({
//   recipeName: z.string().min(3, "Назва має бути довгою"),
//   ingredientsText: z.string().min(10, "Опишіть інгредієнти детальніше"),
// });
// type TextSchema = z.infer<typeof textSchema>;

// // --- 1. Внутрішній компонент для СТРУКТУРОВАНОГО вводу ---
// const StructuredForm = ({
//   onFormSubmit,
//   isPending,
// }: {
//   onFormSubmit: SubmitHandler<StructuredSchema>;
//   isPending: boolean;
// }) => {
//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//   } = useForm<StructuredSchema>({
//     resolver: zodResolver(structuredSchema),
//     defaultValues: {
//       recipeName: "",
//       ingredients: [{ name: "", quantity: 0, unit: "g" }],
//     },
//   });
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "ingredients",
//   });

//   return (
//     <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
//       <div>
//         <label
//           htmlFor="recipeName"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Назва рецепта
//         </label>
//         <input
//           {...register("recipeName")}
//           id="recipeName"
//           className="w-full p-2 border rounded-md mt-1"
//         />
//         {errors.recipeName && (
//           <p className="text-red-500 text-sm mt-1">
//             {errors.recipeName.message}
//           </p>
//         )}
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700">
//           Інгредієнти
//         </label>
//         <div className="space-y-2 mt-1">
//           {fields.map((field, index) => (
//             <div key={field.id} className="grid grid-cols-12 gap-2 items-start">
//               <div className="col-span-5">
//                 <input
//                   {...register(`ingredients.${index}.name`)}
//                   placeholder="Назва"
//                   className="w-full p-2 border rounded-md"
//                 />
//                 {errors.ingredients?.[index]?.name && (
//                   <p className="text-red-500 text-xs mt-1">
//                     {errors.ingredients[index]?.name?.message}
//                   </p>
//                 )}
//               </div>
//               <div className="col-span-3">
//                 <input
//                   type="number"
//                   step="any"
//                   {...register(`ingredients.${index}.quantity`)}
//                   placeholder="К-сть"
//                   className="w-full p-2 border rounded-md"
//                 />
//                 {errors.ingredients?.[index]?.quantity && (
//                   <p className="text-red-500 text-xs mt-1">
//                     {errors.ingredients[index]?.quantity?.message}
//                   </p>
//                 )}
//               </div>
//               <div className="col-span-3">
//                 <select
//                   {...register(`ingredients.${index}.unit`)}
//                   className="w-full p-2 border rounded-md h-[42px]"
//                 >
//                   <option value="g">г</option>
//                   <option value="kg">кг</option>
//                   <option value="ml">мл</option>
//                   <option value="l">л</option>
//                   <option value="tsp">ч.л.</option>
//                   <option value="tbsp">ст.л.</option>
//                   <option value="pc">шт.</option>
//                 </select>
//               </div>
//               <div className="col-span-1 flex items-center h-[42px]">
//                 {fields.length > 1 && (
//                   <button
//                     type="button"
//                     onClick={() => remove(index)}
//                     className="p-2 text-red-500 hover:bg-red-50 rounded-full"
//                   >
//                     &times;
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//           {errors.ingredients?.root && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.ingredients.root.message}
//             </p>
//           )}
//         </div>
//       </div>

//       <Button
//         type="button"
//         variant="outline"
//         size="sm"
//         onClick={() => append({ name: "", quantity: 0, unit: "g" })}
//       >
//         + Додати інгредієнт
//       </Button>

//       <Button type="submit" disabled={isPending} className="w-full">
//         {isPending ? "Аналіз..." : "Зберегти рецепт"}
//       </Button>
//     </form>
//   );
// };

// // --- 2. Внутрішній компонент для ТЕКСТОВОГО вводу ---
// const TextForm = ({
//   onFormSubmit,
//   isPending,
// }: {
//   onFormSubmit: SubmitHandler<TextSchema>;
//   isPending: boolean;
// }) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<TextSchema>({
//     resolver: zodResolver(textSchema),
//   });
//   return (
//     <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
//       <div>
//         <label
//           htmlFor="recipeNameText"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Назва рецепта
//         </label>
//         <input
//           {...register("recipeName")}
//           id="recipeNameText"
//           className="w-full p-2 border rounded-md mt-1"
//         />
//         {errors.recipeName && (
//           <p className="text-red-500 text-sm mt-1">
//             {errors.recipeName.message}
//           </p>
//         )}
//       </div>
//       <div>
//         <label
//           htmlFor="ingredientsText"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Інгредієнти (кожен з нової строки або через кому)
//         </label>
//         <textarea
//           {...register("ingredientsText")}
//           id="ingredientsText"
//           rows={8}
//           className="w-full p-2 border rounded-md mt-1"
//           placeholder={`Наприклад:\n150г курячого філе, 2 яйця\n200г рису, 1кг моркви`}
//         />
//         {errors.ingredientsText && (
//           <p className="text-red-500 text-sm mt-1">
//             {errors.ingredientsText.message}
//           </p>
//         )}
//       </div>
//       <Button type="submit" disabled={isPending} className="w-full">
//         {isPending ? "Аналіз..." : "Зберегти рецепт"}
//       </Button>
//     </form>
//   );
// };

// // --- 3. Головний компонент-контролер, який ви експортуєте ---
// export function CreateRecipeForm() {
//   const [mode, setMode] = useState<"structured" | "text">("structured");
//   const [isPending, startTransition] = useTransition();

//   // Обробник для структурованої форми
//   const handleStructuredSubmit: SubmitHandler<StructuredSchema> = (data) => {
//     startTransition(async () => {
//       const result = await createAndAnalyzeRecipe(data);
//       if (result?.error) toast.error(result.error);
//       else toast.success(result.success || "Рецепт успішно створено!");
//     });
//   };

//   // Обробник для текстової форми
//   const handleTextSubmit: SubmitHandler<TextSchema> = (data) => {
//     startTransition(async () => {
//       const result = await createAndAnalyzeRecipe(data);
//       if (result?.error) toast.error(result.error);
//       else toast.success(result.success || "Рецепт успішно створено!");
//     });
//   };

//   return (
//     <Card>
//       <div className="flex justify-center gap-2 mb-4 border-b pb-4">
//         <Button
//           variant={mode === "structured" ? "default" : "outline"}
//           onClick={() => setMode("structured")}
//         >
//           Структурований
//         </Button>
//         <Button
//           variant={mode === "text" ? "default" : "outline"}
//           onClick={() => setMode("text")}
//         >
//           Текстом
//         </Button>
//       </div>

//       {mode === "structured" ? (
//         <StructuredForm
//           onFormSubmit={handleStructuredSubmit}
//           isPending={isPending}
//         />
//       ) : (
//         <TextForm onFormSubmit={handleTextSubmit} isPending={isPending} />
//       )}
//     </Card>
//   );
// }
