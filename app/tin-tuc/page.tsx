import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { newsArticles } from "@/lib/mock-data";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function NewsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">
        <div>
          <h1 className="text-balance text-3xl font-medium tracking-tight md:text-4xl">
            Tin tức du học
          </h1>
          <p className="mt-3 max-w-lg text-muted-foreground">
            Cập nhật điểm chuẩn, học bổng và kinh nghiệm chuẩn bị hồ sơ mới nhất.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {newsArticles.map((article) => (
            <Card key={article.id} className="flex flex-col gap-3 p-6">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="secondary">{article.category}</Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDate(article.publishedAt)}
                </span>
              </div>
              <h2 className="text-lg font-medium tracking-tight">{article.title}</h2>
              <p className="text-sm text-muted-foreground">{article.excerpt}</p>
            </Card>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
