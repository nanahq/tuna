import {SignupProfileScreen} from './SignupProfile.screen'
import {render} from '@testing-library/react-native'

describe('<SignupProfileScreen', () => {
    it('Should match snapshot', () => {
        const navigation: any = {
            navigate: jest.fn(),
        };
        const route: any = {};

        const rendered = render(
            <SignupProfileScreen
                navigation={navigation}
                route={route}
            />
        )

        // @ts-ignore
        expect(rendered.toJSON()).toMatchSnapshot()
    })
})
