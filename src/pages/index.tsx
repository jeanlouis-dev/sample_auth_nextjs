
import React, { useEffect, useState } from "react";
import { MuiTelInput, matchIsValidTel, MuiTelInputInfo } from "mui-tel-input";
import { LoadingButton } from '@mui/lab';
import { Card, CardContent, Stack, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import QRCode from "react-qr-code";

export default function Home() {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      tel: ""
    }
  });

  const onSubmit = (data: any) => {
    setLoading(true);
    //alert(JSON.stringify(data));
    setData(data.tel);
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center  align-middle justify-center`}
    >
      <Typography style={{ color: "black", fontWeight: "bolder", fontSize: 28 }}>Phone Number authentication Demo</Typography>
      <Card variant="outlined" sx={{ borderWidth: "2px", borderColor: "grey", padding: "20px", marginTop: "25px" }} >
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div  className="flex items-center  flex-col space-y-4 ">
            <Typography style={{ color: "black", fontWeight: "bolder", fontSize: 24 }}>{data ? "Scan Qr code with ADN": "Login"}</Typography>
            <Stack spacing={5} alignItems={"center"}>
              
              {data ? 
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={data}
                viewBox={`0 0 256 256`}
              /> :
                <Controller
                  name="tel"
                  control={control}
                  rules={{ validate: (value) => matchIsValidTel(value) }}
                  render={({ field: { ref: fieldRef, value, ...fieldProps }, fieldState }) => (
                    <MuiTelInput
                      {...fieldProps}
                      defaultCountry="CI"
                      value={value ?? ''}
                      inputRef={fieldRef}
                      style={{ width: "300px" }}
                      helperText={fieldState.invalid ? "Phone number is invalid" : ""}
                      error={fieldState.invalid}
                    />
                  )}
                />
              }

              <LoadingButton type="submit" style={{ height: "50px", width: "300px" }} loading={loading} variant="outlined">
                Submit
              </LoadingButton>

            </Stack>
            </div>
         
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
