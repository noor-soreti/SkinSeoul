import { StyleSheet, View } from 'react-native'
import React from 'react'

interface Props {
    children: React.ReactNode;
}

const CurvedBackground = ({ children }: Props) => {
    return (
        <View style={styles.container}>
            <View style={styles.background} />
            <View style={styles.content}>
                {children}
            </View>
        </View>
    )
}

export default CurvedBackground

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: '100%',
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 250,
        backgroundColor: '#ED6672',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    content: {
        position: 'relative',
        zIndex: 1,
    }
}) 