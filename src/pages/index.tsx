import React, { useEffect, useState } from "react";
import { MuiTelInput, matchIsValidTel } from "mui-tel-input";
import { LoadingButton } from '@mui/lab';
import { Stack, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import QRCode from "react-qr-code";
import socketClusterClient from 'socketcluster-client';
import { v4 as uuidv4 } from 'uuid';
import Image from "next/image";

const options = {
  secure: false,
  hostname: "localhost",
  port: 8000,
  autoReconnectOptions: {
    initialDelay: 5000,
    maxDelay: 5000
  },
  //ackTimeout: 1000 * 60 * 3
};

export default function Home() {
  const [data, setData] = React.useState("");
  const [loading, setLoading] = useState(false);
  const [channelId, setChannelId] = useState<string>("");
  const [result, setResult] = useState<any>();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      tel: ""
    }
  });

  const onSubmit = (data: any) => {
    if (result != undefined) {
      setData("");
      setResult(undefined);
    } else {
      setLoading(true);
      data.code = uuidv4();
      data.channelId = channelId;
      data.clientId = "0x84f18b513dc93d57F523c6663Afebf0EdBB98825";
      setData(JSON.stringify(data));
    }

  };

  useEffect(() => {
    if (channelId) {
      if (typeof window !== 'undefined') {

        let socket = socketClusterClient.create(options);
        console.log(`client Id: ${socket.clientId}`);
        (async () => {
          let channel = socket.subscribe(channelId);
          for await (let data of channel) {
            console.log("DATA from ADN", data);
             setResult(data);
             setLoading(false);
          }
        })();


        return () => {
          if (socket) {
            socket.disconnect();
          }
        };
      }
    }
  }, [channelId]);

  useEffect(() => {
    setChannelId(uuidv4());
  }, []);


  return (
    <main
      className={`flex min-h-screen flex-col items-center  align-middle justify-center`}
    >
       <Stack direction={"row"} spacing={1} style={{ position: "fixed", top: 20 }}>
        <Typography style={{ color: "black", fontWeight: "bolder", fontSize: 32 }}>Phone Number authentication Demo</Typography>
      </Stack>


      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center  flex-col space-y-4 ">

          {result != undefined ?
            <>
              <Typography style={{ color: "black", fontWeight: "bolder", fontSize: 24, marginBottom: 50 }}>{result ? "Successfull authenticated" : "Verification failed"}</Typography>
              <Image
                src={result ? "/success.svg" : "/error.svg"}
                alt="Result Logo"
                width={128}
                height={128}
                priority={false}
              />
            </>
            :
            <>
              <Typography style={{ color: "black", fontWeight: "bolder", fontSize: 24 }}>{data ? "Scan Qr code with ADN" : ""}</Typography>
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
            </>
          }


          <LoadingButton type="submit" style={{ height: "50px", width: "300px", marginTop: 50 }} loading={loading} variant="outlined">
            {result != undefined ? "reset" : "Submit"}
          </LoadingButton>
        </div>
      </form>
    </main>
  );
}
