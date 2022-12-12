import {IconButton} from '@components/commons/buttons/IconButton'
import {tailwind} from '@tailwind'
import {useAuthPersistence} from '@contexts/AuthPersistenceProvider'

export function HeaderLogoutButton (): JSX.Element {
    const {clearToken} = useAuthPersistence()
    const onLogoutPress =  async (): Promise<void> => (await clearToken())
    return (
        <IconButton
            testID='HeaderLogoutButton'
            iconSize={20}
            iconStyle={tailwind('text-white')}
            iconName='power'
            iconType='Feather'
            onPress={onLogoutPress}
        />
    )
}
