import {render} from '@testing-library/react-native'
import {LoaderComponent} from './LoaderComponent'

describe('<LoaderComponent />', () => {
    it('Should match snapshot', () => {
        const rendered = render(
          <LoaderComponent />
        )
        // @ts-ignore
        expect(rendered.toJSON()).toMatchSnapshot()
    })
})
