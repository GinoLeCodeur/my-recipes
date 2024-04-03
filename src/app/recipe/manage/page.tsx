import Image from 'next/image';
import Link from "next/link";
import { RemoveRecipeButton } from "@/app/recipe/manage/RemoveRecipeButton";
import { getRecipes, getRecipesByUser } from '@/app/recipe/actions';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { getServerSession } from 'next-auth/next';
import { UserRole } from '@/types';

export default async function Page() {
    const session = await getServerSession(authOptions);
    
    const { rows: recipesData } =
        session?.user.role === UserRole.ADMIN
            ? await getRecipes()
            : await getRecipesByUser();
    
    return (
        <>
            <div className="flex items-baseline">
                <h1 className="flex-1 text-4xl font-medium">Recepten beheer</h1>
                <Link href="/recipe/manage/add" className="flex items-center">
                    <span className="block material-symbols-outlined mr-1 -mb-[1px]">
                        add
                    </span>
                    Recept toevoegen
                </Link>
            </div>

            <section className="mt-4">
                <ol>
                    {recipesData.map((recipe) => (
                        <li key={recipe.recipeId} className="mb-4">
                            <article className="flex bg-[#fff]">
                                <picture className="w-[250px]">
                                    <Image
                                        src={`${recipe.image || 'https://placehold.co/600x400?text=Hello+world'}`}
                                        alt={recipe.name}
                                        width="600"
                                        height="400"
                                        unoptimized
                                        className="aspect-video object-cover"
                                    />
                                </picture>
                                <div className="flex-1 flex flex-col p-4">
                                    <Link href={`/recipe/${recipe.slug}`}>
                                        <h2 className="font-bold">
                                            {recipe.name}
                                        </h2>
                                    </Link>
                                    <p className="flex-1">
                                        {recipe.description &&
                                        recipe.description?.length < 120
                                            ? recipe.description
                                            : `${recipe.description?.substring(
                                                  0,
                                                  120
                                              )}...`}
                                    </p>
                                    <ul className="flex">
                                        <li className="mr-4">
                                            <Link
                                                href={`/recipe/${recipe.slug}`}
                                                className="flex items-center"
                                            >
                                                <span className="block material-symbols-outlined mr-1 -mb-[3px]">
                                                    visibility
                                                </span>
                                                Bekijken
                                            </Link>
                                        </li>
                                        <li className="mr-4">
                                            <Link
                                                href={`/recipe/manage/edit/${recipe.slug}`}
                                                className="flex items-center"
                                            >
                                                <span className="block material-symbols-outlined mr-1">
                                                    edit
                                                </span>
                                                Bewerken
                                            </Link>
                                        </li>
                                        <li>
                                            <RemoveRecipeButton
                                                recipe={recipe}
                                            />
                                        </li>
                                    </ul>
                                </div>
                            </article>
                        </li>
                    ))}
                </ol>
            </section>
        </>
    );
}