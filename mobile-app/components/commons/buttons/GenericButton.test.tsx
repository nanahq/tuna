import {GenericButton} from './GenericButton'
import {render} from "@testing-library/react-native"

describe('<GenericButton />', () => {
    it('Should match snapshot',
        () => {
            const onPress = jest.fn()
            const rendered = render(<GenericButton
                onPress={onPress}
                testId='GenericButton.Test'
                label='Testbutton'
                backgroundColor={{}}
            />)
            // @ts-ignore
            expect(rendered.toJSON).toMatchSnapshot()
        })


})
