import { useParams, Navigate } from "react-router-dom";
import { getServiceBySlug } from "@/data/serviceData";
import ServiceLandingPage from "@/components/ServiceLandingPage";

const ServicePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getServiceBySlug(slug) : undefined;

  if (!service) {
    return <Navigate to="/" replace />;
  }

  return <ServiceLandingPage service={service} />;
};

export default ServicePage;
