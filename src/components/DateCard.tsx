import { Card, CardContent, Typography, Box } from '@mui/material';
import { CalendarToday } from '@mui/icons-material';

interface DateCardProps {
  date: string;
}

const DateCard: React.FC<DateCardProps> = ({ date }) => {
  if (!date) return null;

  return (
    <Card sx={{ maxWidth: 400 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <CalendarToday color="primary" fontSize="small" />
          <Typography variant="h6" component="h2">
            Prediction Date
          </Typography>
        </Box>
        <Typography variant="body1" color="text.primary">
          {date}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DateCard;