import {render} from '@testing-library/react-native'
import {LoginButtonWithText} from './LoginButtonWithText'

jest.mock("@react-navigation/native", () => ({
    useNavigation: jest.fn(),
}));

describe('<LoginButtonWithText />', () => {
    it('should match snapshot', () => {

        const rendered = render (
            <LoginButtonWithText  />
        )

        // @ts-ignore
        expect(rendered.toJSON()).toMatchSnapshot()

    })

})
