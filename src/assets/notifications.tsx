import { toast } from 'react-toastify';
import Typography from '@mui/material/Typography';

/**
 * Displays appropriate notification message according to processed action
 * 
 * @param type type of notification
 * @param itemName name of processed record
 * @param promise promise of processed action
 */
export const notify = (type: string, itemName: string, promise: Promise<void>) => {
  const text = { pending: "", success: "", error: "" }

  switch (type) {
    case 'add':
      text.pending = "Adding";
      text.success = "Successfully added";
      text.error = "Failed to add";
      break;
    case 'delete':
      text.pending = "Removing";
      text.success = "Successfully removed";
      text.error = "Failed to remove";
      break;
    case 'edit':
      text.pending = "Saving";
      text.success = "Successfully saved";
      text.error = "Failed to edit";
      break;
    default:
      return null;
  }

  // display message depending on resolved promise
  toast.promise(
    promise,
    {
      pending: {
        render() {
          return (
            <>
              <Typography variant="body1" fontWeight={600} display="block">{text.pending}</Typography>
              <Typography variant="body2" display="block">"{itemName}"</Typography>
            </>
          )
        }
      },
      success: {
        render() {
          return (
            <>
              <Typography variant="body1" fontWeight={600} display="block">{text.success}</Typography>
              <Typography variant="body2" display="block">"{itemName}"</Typography>
            </>
          )
        }
      },
      error: {
        render({ data }) {
          return (
            <>
              <Typography variant="body1" fontWeight={600} display="block">{text.error}</Typography>
              <Typography variant="body2" display="block">"{itemName}"</Typography>
              {data instanceof Error && <Typography variant="caption" display="block">{data.message}</Typography>}
            </>
          )
        },
      }
    }
  )
}

/**
 * Displays notification message while demo data are processed
 * 
 * @param promise promise of processed action
 */
export const demoNotify = (promise: Promise<void>) => {
  // display message depending on resolved promise
  toast.promise(
    promise,
    {
      pending: {
        render() {
          return <Typography variant="body1" fontWeight={600} display="block">Importing demo data...</Typography>
        }
      },
      success: {
        render() {
          return <Typography variant="body1" fontWeight={600} display="block">Successfully imported</Typography>
        }
      },
      error: {
        render({ data }) {
          return (
            <>
              <Typography variant="body1" fontWeight={600} display="block">Something went wrong</Typography>
              {data instanceof Error && <Typography variant="caption" display="block">{data.message}</Typography>}
            </>
          )
        },
      }
    }
  )
}
