import { CreateNote } from "@/components/CreateNote";

export default function CreateNotePage() {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-8 md:py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
          Express Your{" "}
          <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            Truth
          </span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-[600px] mx-auto">
          This Valentine&apos;s Day, share your authentic thoughts anonymously.
          Join our community of singles expressing themselves through digital
          notes.
        </p>
      </div>

      <div className="backdrop-blur-sm bg-card/30 rounded-xl shadow-sm">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Write Your Note</h2>
            <p className="text-sm text-muted-foreground">
              Whether you&apos;re celebrating independence or expressing your
              feelings, your voice matters here
            </p>
          </div>

          <CreateNote />

          <div className="pt-4 border-t border-border/40">
            <p className="text-sm text-muted-foreground text-center">
              Your identity stays private. Your thoughts become part of our
              collective expression.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
