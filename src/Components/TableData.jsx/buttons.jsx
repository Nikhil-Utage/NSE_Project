import { Button } from "@mui/material"

const Buttons = ({handleDownloadExcel}) => {
  return (
    <Button
    variant="contained"
    color="primary"
    onClick={handleDownloadExcel}
    sx={{ mb: 2 }}
>
    Download Excel
</Button>
  )
}

export default Buttons