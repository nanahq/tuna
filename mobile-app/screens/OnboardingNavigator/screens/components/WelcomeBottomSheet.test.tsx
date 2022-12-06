import {render} from '@testing-library/react-native'
import {WelcomeButtonSheet} from './WelcomeBottomSheet'
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import React from "react";


jest.mock("@react-navigation/native", () => ({
    useNavigation: jest.fn(),
}));
describe('<WelcomeButtonSheet />', () => {
    it('should match snapshot', () => {
        const useRefSpy = jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: { focus: jest.fn } }) as any;
        const rendered = render(
            <BottomSheetModalProvider>
                <WelcomeButtonSheet promptModalName='test' modalRef={useRefSpy} />
            </BottomSheetModalProvider>
        )
        // @ts-ignore
        expect(rendered.toJSON()).toMatchSnapshot()
    })
})
