import { Box, Tooltip } from '@chakra-ui/react'
import React, {useState} from 'react'

const SideSearch = () => {
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()

    return (
        <div>
            <Box>
                <Tooltip></Tooltip>
            </Box>
        </div>
    )
}

export default SideSearch