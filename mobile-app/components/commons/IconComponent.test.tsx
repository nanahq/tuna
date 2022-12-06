import {render} from '@testing-library/react-native'
import {IconComponent} from './IconComponent'

describe('<IconComponent />', () => {
    it('Should match snapshot', () => {
        const rendered = render(
            <IconComponent iconType='Feather' name='arrow-left' />
        )
        // @ts-ignore
        expect(rendered.toJSON()).toMatchSnapshot()
    })
})
