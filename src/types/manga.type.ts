export interface BookType {
    type: "book" | "chapter";
    title: string;
    _id: string;
    book: number;
    slug: string;
    images: string[];
  }
  
  export interface MangaTypeList {
    description?: string;
    _id: string;
    title: string;
    chapters?: BookType[];
    tagList?: string[];
    image: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    uploader: string;
    lastEditor: string;
  }
  