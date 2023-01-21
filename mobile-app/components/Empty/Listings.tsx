import {Text, View} from 'react-native'
import {IconComponent} from "@components/commons/IconComponent";
import {tailwind} from '@tailwind'

interface EmptyListingsCategories  {
    title: string
    subtitle?: string
    type: 'OPTION' | 'MENU' | 'CATEGORY'
}

export function EmptyMenu (props: EmptyListingsCategories): JSX.Element {
    const iconMeta = {
        type: '',
        name: ''
    } as any

    switch (props.type) {
        case "CATEGORY":
            iconMeta.name = 'category'
            iconMeta.type = 'MaterialIcons'
            break;
        case "MENU":
            iconMeta.name = 'food-outline'
            iconMeta.type = 'MaterialCommunityIcons'
            break;
        case "OPTION":
            iconMeta.name = 'format-list-checkbox'
            iconMeta.type = 'MaterialCommunityIcons'
            break;
    }
    return (
        <View style={tailwind('flex flex-col items-center justify-center w-full h-full')}>
            <IconComponent
                iconType={iconMeta.type}
                name={iconMeta.name}  size={60}
                style={tailwind('text-brand-gray-700')}
            />
           <View style={tailwind('flex flex-col items-center w-3/4 mt-2')}>
               <Text style={tailwind('font-semibold text-2xl text-brand-gray-800 mb-1')}>{props.title}</Text>
               {props.subtitle &&  <Text style={tailwind('text-center font-normal text-sm text-brand-gray-800')}>{props.subtitle}</Text>}
           </View>
        </View>
    )
}
