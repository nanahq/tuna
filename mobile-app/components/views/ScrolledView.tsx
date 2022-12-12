import {forwardRef} from "react";

import {ScrollView} from "react-native";

interface ScrolledViewProps {
    testId: string
}

type Props = ScrollView["props"] & ScrolledViewProps

export const ScrolledView = forwardRef(
    (props: Props, ref: React.Ref<any>): JSX.Element => {
        const {style, ...rest} = props

        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={style}
                ref={ref}
                {...rest}
            />
        );
    }
);
