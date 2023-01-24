import {forwardRef} from "react";
import {tailwind} from "@tailwind";

import {FlashList, FlashListProps} from "@shopify/flash-list";
import {ScrollView} from "react-native";

const DEFAULT_ESTIMATED_ITEM_SIZE = 5;

interface ParentContainer {
    parentContainerStyle?: { [p: string]: string };
}

type ThemedFlashListProps = FlashListProps<any>  & ParentContainer;

export const GenericFlashList = forwardRef(
    (props: ThemedFlashListProps, ref: React.Ref<any>): JSX.Element => {
        const {
            contentContainerStyle,
            estimatedItemSize = DEFAULT_ESTIMATED_ITEM_SIZE,
            parentContainerStyle,
            ...otherProps
        } = props;


        const styles = { ...contentContainerStyle };

        return (
            <ScrollView
                contentContainerStyle={[
                    { minHeight: 2 },
                    tailwind("flex-grow"),
                    parentContainerStyle,
                ]}
                ref={ref}
            >
                <FlashList
                    estimatedItemSize={
                        estimatedItemSize === 0
                            ? DEFAULT_ESTIMATED_ITEM_SIZE // FlashList crashes if this value is 0
                            : estimatedItemSize
                    }
                    contentContainerStyle={styles}
                    {...otherProps}
                />
            </ScrollView>
        );
    }
);
