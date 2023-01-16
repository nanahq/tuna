import * as React from "react";
import ContentLoader, {IContentLoaderProps, Rect,} from "react-content-loader/native";

export function ProfileHeaderSkeleton (
    props: JSX.IntrinsicAttributes &
        IContentLoaderProps & { children?: React.ReactNode }
): JSX.Element {
    return (

        <ContentLoader
            width={400}
            height={160}
            viewBox="0 0 400 160"
            backgroundColor="#ecebeb"
            foregroundColor="#4a4a4a"
            {...props}
        >
                <Rect x="0" y="0" rx="4" ry="4" width="200" height="30" />
                <Rect x="0" y="50" rx="2" ry="2" width="100" height="20" />
                <Rect x="150" y="50" rx="2" ry="2" width="100" height="20" />
            </ContentLoader>
    )
}
