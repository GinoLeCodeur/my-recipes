import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { getRecipes } from './recipe/actions';

export default async function Home() {
    const recipesData = await getRecipes();

    return (
        <section>
            <Suspense fallback={<p>Loading recipes...</p>}>
                <ol className="grid grid-cols-4 gap-4">
                    {recipesData.rows.map((recipe) => (
                        <li key={recipe.recipeId}>
                            <article>
                                <Link
                                    href={`/recipe/${recipe.slug}`}
                                    className="flex flex-col bg-[#fff]"
                                >
                                    <picture>
                                        <Image
                                            src={`${
                                                recipe.image ||
                                                'https://placehold.co/600x400?text=Hello+world'
                                            }`}
                                            alt={recipe.name}
                                            width="600"
                                            height="400"
                                            unoptimized
                                            className="w-full aspect-video object-cover"
                                        />
                                    </picture>
                                    <h2 className="p-4 font-bold">
                                        {recipe.name}
                                    </h2>
                                </Link>
                            </article>
                        </li>
                    ))}
                </ol>
            </Suspense>
        </section>
    );
}
