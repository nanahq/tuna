import {render} from '@testing-library/react-native'
import {ErrorMessage} from './ErrorMessage'


describe('<ErrorMessage />', () => {
    it('should match snapshot', () => {
        const rendered = render(<ErrorMessage error='Something went wrong' />)
        // @ts-ignore
        expect(rendered.toJSON()).toMatchSnapshot()
    })
})
