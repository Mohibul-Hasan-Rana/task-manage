export interface SharedPageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
}

export interface PageProps extends SharedPageProps {
    flash?: {
        success?: string;
        error?: string;
    };
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}
