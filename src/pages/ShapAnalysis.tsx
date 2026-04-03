import  { Box, Chip, Stack,Typography, Card, CardContent, Button } from "@mui/material";
import { ShapGlobalChart, ShapWaterfallChart } from "../components/ShapComponents";
import { useState } from "react";
import { usePredictionStore } from "../store/usePredictionStore";
import { useNavigate } from "react-router-dom";
import AccessTimeIcon from '@mui/icons-material/AccessTime'

const ShapAnalysis = () => {
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const { globalShap , localShap, Predicted} = usePredictionStore()
  const navigate = useNavigate()

  return (
    <Box sx={{ p: { xs: 1, sm: 2 } }}>
      {/* Page Title */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          spacing={1}
          mb={2}
        >
          <Typography variant="h5" fontWeight={600} sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
            SHAP Analysis
          </Typography>

          <Button
            variant="contained"
            size="small"
            sx={{ height: 40, textTransform: 'none' }}
            onClick={() => navigate('/predict')}
          >
            Go back to Prediction
          </Button>
        </Stack>

      {Predicted ? (
      <Stack spacing={4}>
        {/* Global SHAP */}
        <Card>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={500} gutterBottom>
              Global Feature Importance
            </Typography>

            <Box sx={{ width: '100%', height: { xs: 300, md: 500 } }}>
              <ShapGlobalChart data={globalShap} />
            </Box>
          </CardContent>
        </Card>

        {/* Hour Selector */}
        <Card 
              elevation={0}
              sx={{ 
                width: '100%',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <AccessTimeIcon color="primary" fontSize="small" />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Select Hour
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: 'repeat(4, 1fr)',
                      sm: 'repeat(6, 1fr)',
                      md: 'repeat(8, 1fr)',
                    },
                    gap: 1,
                  }}
                >
                  {Array.from({ length: 24 }, (_, i) => i + 1).map((hour) => (
                    <Chip
                      key={hour}
                      label={hour}
                      clickable
                      size="small"
                      color={selectedHour === hour ? 'primary' : 'default'}
                      variant={selectedHour === hour ? 'filled' : 'outlined'}
                      onClick={() => setSelectedHour(hour)}
                      sx={{
                        minWidth: 0,
                        width: '100%',
                        fontWeight: selectedHour === hour ? 600 : 400,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 1,
                        },
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
        {/* Local SHAP */}
        <Card>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={500} gutterBottom>
              Local Explanation
              {selectedHour && ` — Hour ${selectedHour}`}
            </Typography>

            {selectedHour ? (
              <Box sx={{ width: '100%', height: { xs: 280, md: 400 } }}>
                <ShapWaterfallChart
                  hourData={localShap[selectedHour-1]}
                />
              </Box>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 2 }}
              >
                Please select an hour to view local SHAP explanation.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Stack>) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ 
                      mt: 2,
                      fontStyle: 'italic',
                      textAlign: 'center',
                      py: 3,
                      px: 2,
                      backgroundColor: 'action.hover',
                      borderRadius: 1,
                      border: '1px dashed',
                      borderColor: 'divider'
                    }}
                  >
                    Please make a prediction to view SHAP explanation.
                  </Typography>
      )}
    
    </Box>
  );
};

export default ShapAnalysis;

