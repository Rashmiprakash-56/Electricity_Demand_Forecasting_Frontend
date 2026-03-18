import { Card, CardContent, Typography, Box } from '@mui/material';
import {type DataCardProps} from "../types/common"

const DataCard: React.FC<DataCardProps> = ({
  title,
  value,
  unit,
  loading = false,
}) => {
  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: '0px 8px 20px rgba(0,0,0,0.06)',
        border: '1px solid #e2e8f0',
      }}
    >
      <CardContent>
        <Typography
          variant="body2"
          sx={{ color: '#64748b', mb: 1 }}
        >
          {title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 600, color: '#1e293b' }}
          >
            {loading ? '—' : value}
          </Typography>

          {unit && !loading && (
            <Typography
              variant="body2"
              sx={{ ml: 1, color: '#475569' }}
            >
              {unit}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DataCard;
