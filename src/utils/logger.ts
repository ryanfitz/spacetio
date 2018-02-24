import bunyan from "bunyan";

export default bunyan.createLogger({
  name: "spacetio",
  level: "info",
  serializers: bunyan.stdSerializers
});
