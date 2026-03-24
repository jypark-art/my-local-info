import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "src/content/posts");

export interface PostData {
  slug: string;
  title: string;
  date: string;
  summary: string;
  category: string;
  tags: string[];
  content?: string;
}

export function getSortedPostsData(): PostData[] {
  // Get file names under /src/content/posts
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      // Remove ".md" from file name to get id (slug)
      const slug = fileName.replace(/\.md$/, "");

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Handle date conversion: Date -> YYYY-MM-DD
      let dateValue = matterResult.data.date;
      if (dateValue instanceof Date) {
        dateValue = dateValue.toISOString().split("T")[0];
      } else if (typeof dateValue !== "string") {
        dateValue = "";
      }

      // Combine the data with the slug
      return {
        ...matterResult.data,
        slug,
        title: matterResult.data.title || "",
        date: dateValue,
        summary: matterResult.data.summary || "",
        category: matterResult.data.category || "",
        tags: matterResult.data.tags || [],
      } as PostData;
    });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getPostData(slug: string): Promise<PostData | null> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Handle date conversion: Date -> YYYY-MM-DD
  let dateValue = matterResult.data.date;
  if (dateValue instanceof Date) {
    dateValue = dateValue.toISOString().split("T")[0];
  } else if (typeof dateValue !== "string") {
    dateValue = "";
  }

  // Use remark to convert markdown into HTML string if needed
  // But since the user wants react-markdown in the component, we'll just return the raw content.
  
  return {
    ...matterResult.data,
    slug,
    content: matterResult.content,
    title: matterResult.data.title || "",
    date: dateValue,
    summary: matterResult.data.summary || "",
    category: matterResult.data.category || "",
    tags: matterResult.data.tags || [],
  } as PostData;
}
